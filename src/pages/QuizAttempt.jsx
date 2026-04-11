import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentApi } from '../api/studentApi';
import Navbar from '../components/common/Navbar';
import Timer from '../components/common/Timer';
import { ChevronLeft, ChevronRight, AlertTriangle, ShieldAlert } from 'lucide-react';

const MAX_WARNINGS = 3;

const QuizAttempt = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [quizMeta, setQuizMeta] = useState(null); // stores quiz display info from raw entity
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Warning system state
  const [warningCount, setWarningCount] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const attemptRef = useRef(null); // ref to avoid stale closures

  // Keep attemptRef in sync
  useEffect(() => {
    attemptRef.current = attempt;
  }, [attempt]);

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    startQuiz();
  }, [quizId]);

  // Tab-switch detection
  useEffect(() => {
    if (!attempt || attempt.status === 'COMPLETED') return;

    const handleVisibilityChange = async () => {
      if (document.hidden && attemptRef.current && attemptRef.current.status !== 'COMPLETED') {
        try {
          const response = await studentApi.recordWarning(attemptRef.current.id);
          const updatedAttempt = response.data;
          const newCount = updatedAttempt.warningCount;
          setWarningCount(newCount);

          if (updatedAttempt.status === 'COMPLETED') {
            // Auto-submitted by backend (3rd warning)
            setAutoSubmitted(true);
            setShowWarningModal(true);
          } else {
            setShowWarningModal(true);
          }
        } catch (error) {
          console.error('Failed to record warning:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [attempt]);

  const startQuiz = async () => {
    try {
      const attemptResponse = await studentApi.startQuiz(quizId);
      const attemptData = attemptResponse.data;
      setAttempt(attemptData);
      setWarningCount(attemptData.warningCount || 0);

      // Capture display info from the flat DTO (startQuiz now returns QuizAttemptResponse)
      if (attemptData) {
        setQuizMeta({
          title: attemptData.quizTitle,
          subjectName: attemptData.subjectName,
          topicName: attemptData.topicName,
          durationMinutes: attemptData.durationMinutes,
        });
      }


      // Load student answers — each answer contains the full question object
      const answersResponse = await studentApi.getAttemptAnswers(attemptData.id);
      const answersData = answersResponse.data;
      setAnswers(answersData);

      // Derive the ordered question list from flat answer fields
      const qs = answersData.map((ans) => ({
        id: ans.questionId,
        questionText: ans.questionText,
        codeSnippet: ans.codeSnippet,
        type: ans.type,
        option1: ans.option1,
        option2: ans.option2,
        option3: ans.option3,
        option4: ans.option4,
        marks: ans.marks,
      }));
      setQuestions(qs);
    } catch (error) {
      alert(error.response?.data?.message || error.response?.data || 'Failed to start quiz');
      navigate('/student');
    }
    setLoading(false);
  };

  const handleAnswerSelect = async (optionNumber) => {
    const currentQuestion = questions[currentQuestionIndex];
    const answerData = {
      questionId: currentQuestion.id,
      selectedOption: optionNumber,
    };

    try {
      await studentApi.submitAnswer(attempt.id, answerData);

      // Update local answers state
      setAnswers((prev) =>
        prev.map((ans) =>
          ans.questionId === currentQuestion.id
            ? { ...ans, selectedOption: optionNumber, attempted: true }
            : ans
        )
      );
    } catch (error) {
      alert('Failed to submit answer');
    }
  };

  const handleTimeUp = useCallback(async () => {
    await forceSubmitQuiz();
  }, [attempt]);

  const forceSubmitQuiz = async () => {
    if (!attemptRef.current) return;
    try {
      await studentApi.submitQuiz(attemptRef.current.id);
      alert('Quiz auto-submitted! Time is up.');
      navigate('/student/results');
    } catch (error) {
      console.error('Failed to auto-submit quiz:', error);
    }
  };

  const submitQuiz = async () => {
    if (!confirm('Are you sure you want to submit?')) return;

    try {
      await studentApi.submitQuiz(attempt.id);
      alert('Quiz submitted successfully!');
      navigate('/student/results');
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data || error.message || 'Failed to submit quiz';
      alert(`Submit failed: ${msg}`);
    }
  };

  const dismissWarning = () => {
    if (autoSubmitted) {
      navigate('/student/results');
    } else {
      setShowWarningModal(false);
    }
  };

  const getQuestionStatus = (index) => {
    if (index === currentQuestionIndex) return 'current';
    const answer = answers.find((ans) => ans.questionId === questions[index]?.id);
    if (answer?.attempted) return 'attempted';
    return 'not-attempted';
  };

  const navigateToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  // --- RENDER ---

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 font-medium">Preparing your quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!attempt || !questions || questions.length === 0) {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
                    <div className="text-red-500 mb-4 text-5xl">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No Questions Found</h2>
                    <p className="text-gray-600 mb-6">This quiz doesn't have any questions or failed to load. Please contact your administrator.</p>
                    <button 
                        onClick={() => navigate('/student')}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Go Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return null;
  const currentAnswer = answers.find((ans) => ans.questionId === currentQuestion.id);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">
      <Navbar />

      {/* ===== WARNING MODAL OVERLAY ===== */}
      {showWarningModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`relative w-full max-w-md mx-4 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ${autoSubmitted ? 'bg-red-600' : 'bg-white'}`}>
            {/* Decorative top bar */}
            <div className={`h-2 w-full ${autoSubmitted ? 'bg-red-800' : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500'}`}></div>
            
            <div className="p-10 text-center">
              {autoSubmitted ? (
                <>
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert className="text-white" size={40} />
                  </div>
                  <h2 className="text-3xl font-black text-white mb-3">Quiz Auto-Submitted</h2>
                  <p className="text-red-100 font-medium mb-8 leading-relaxed">
                    You left the quiz screen <strong className="text-white">{warningCount} times</strong>. Your quiz has been automatically submitted as per the policy.
                  </p>
                  <button
                    onClick={dismissWarning}
                    className="w-full bg-white text-red-600 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-red-50 transition-colors"
                  >
                    View My Results
                  </button>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-amber-100/50">
                    <AlertTriangle className="text-amber-600" size={40} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-3">
                    Warning #{warningCount}
                  </h2>
                  <p className="text-slate-600 font-medium mb-4 leading-relaxed">
                    You switched away from the quiz tab. This is <strong>not allowed</strong> during an active exam.
                  </p>

                  {/* Warning Dots */}
                  <div className="flex items-center justify-center gap-3 mb-8">
                    {Array.from({ length: MAX_WARNINGS }).map((_, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2 transition-all duration-500
                          ${i < warningCount 
                            ? 'bg-red-500 text-white border-red-600 scale-110' 
                            : 'bg-slate-100 text-slate-400 border-slate-200'}`}
                        >
                          {i + 1}
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                          {i < warningCount ? 'Used' : 'Left'}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-8">
                    <p className="text-red-700 text-sm font-bold">
                      ⚠️ {MAX_WARNINGS - warningCount} warning{MAX_WARNINGS - warningCount !== 1 ? 's' : ''} remaining. After {MAX_WARNINGS} warnings, your quiz will be <strong>auto-submitted</strong>.
                    </p>
                  </div>

                  <button
                    onClick={dismissWarning}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-black transition-colors shadow-lg shadow-slate-200"
                  >
                    I Understand — Continue Quiz
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== WARNING COUNTER BADGE (always visible) ===== */}
      {warningCount > 0 && !showWarningModal && (
        <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-right duration-500">
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-lg border text-sm font-bold
            ${warningCount >= 2 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
            <AlertTriangle size={16} />
            <span>{warningCount}/{MAX_WARNINGS} Warnings</span>
          </div>
        </div>
      )}

      <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 uppercase font-black">
              {quizMeta?.subjectName?.charAt(0) || 'Q'}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  {quizMeta?.subjectName}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  • {quizMeta?.topicName}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">
                {quizMeta?.title}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="h-10 w-[1px] bg-slate-200 hidden md:block"></div>
             <Timer
              durationMinutes={quizMeta?.durationMinutes}
              onTimeUp={handleTimeUp}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Question Area */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              {/* Question Progress Bar */}
              <div className="h-1.5 w-full bg-slate-100">
                <div 
                  className="h-full bg-blue-600 transition-all duration-500 ease-out" 
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>

              <div className="p-8 md:p-10">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {currentQuestion.marks || 1} Point{(currentQuestion.marks || 1) > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-slate-800 leading-relaxed mb-6">
                    {currentQuestion.questionText}
                  </h2>

                  {currentQuestion.codeSnippet && (
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
                      <pre className="relative bg-slate-900 p-6 rounded-xl overflow-x-auto text-sm font-mono text-blue-100 border border-slate-800 shadow-xl">
                        {currentQuestion.codeSnippet}
                      </pre>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 mb-10">
                  {[1, 2, 3, 4].map((optionNum) => {
                    const isSelected = currentAnswer?.selectedOption === optionNum;
                    return (
                      <button
                        key={optionNum}
                        onClick={() => handleAnswerSelect(optionNum)}
                        className={`group relative flex items-center p-5 rounded-2xl border-2 transition-all duration-300 transform active:scale-[0.98] text-left
                          ${isSelected 
                            ? 'border-blue-600 bg-blue-50/50 shadow-md translate-x-1' 
                            : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm mr-5 transition-colors
                          ${isSelected 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                          {String.fromCharCode(64 + optionNum)}
                        </div>
                        <span className={`flex-1 font-semibold transition-colors
                          ${isSelected ? 'text-blue-950' : 'text-slate-700'}`}>
                          {currentQuestion[`option${optionNum}`]}
                        </span>
                        {isSelected && (
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                  <button
                    onClick={() => navigateToQuestion(currentQuestionIndex - 1)}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center gap-2 font-bold px-6 py-3 rounded-2xl transition disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 hover:bg-slate-100"
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>

                  <div className="flex gap-4">
                    {currentQuestionIndex === questions.length - 1 ? (
                      <button
                        onClick={submitQuiz}
                        className="bg-green-600 text-white px-10 py-3 rounded-2xl hover:bg-green-700 font-bold shadow-lg shadow-green-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
                      >
                        Submit Test
                      </button>
                    ) : (
                      <button
                        onClick={() => navigateToQuestion(currentQuestionIndex + 1)}
                        className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl hover:bg-black font-bold shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
                      >
                        Save & Next
                        <ChevronRight size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-extrabold text-slate-800">Quick Navigation</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter bg-slate-50 px-2 py-1 rounded">
                   {questions.length} Questions
                </span>
              </div>

              <div className="flex flex-col gap-8">
                {/* Organize into groups of 4 as per README */}
                {Array.from({ length: Math.ceil(questions.length / 4) }).map((_, groupIndex) => (
                  <div key={groupIndex} className="space-y-3">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] ml-2">
                       Questions {groupIndex * 4 + 1} - {Math.min((groupIndex + 1) * 4, questions.length)}
                    </span>
                    <div className="grid grid-cols-4 gap-3">
                      {questions.slice(groupIndex * 4, (groupIndex + 1) * 4).map((_, i) => {
                        const index = groupIndex * 4 + i;
                        const status = getQuestionStatus(index);
                        const isCurrent = index === currentQuestionIndex;
                        
                        let colorClasses = "";
                        if (status === 'current') colorClasses = "bg-amber-500 text-white shadow-amber-100 ring-4 ring-amber-100";
                        else if (status === 'attempted') colorClasses = "bg-green-500 text-white shadow-green-100";
                        else colorClasses = "bg-red-500 text-white shadow-red-100";

                        return (
                          <button
                            key={index}
                            onClick={() => navigateToQuestion(index)}
                            className={`relative h-12 w-full rounded-xl flex items-center justify-center font-black text-sm transition-all duration-200 shadow-md hover:-translate-y-1 active:translate-y-0
                              ${colorClasses} ${isCurrent ? 'ring-4 ring-blue-100 border-2 border-white' : ''}`}
                          >
                            {index + 1}
                            {isCurrent && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white animate-pulse"></div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100 space-y-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Legend</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-bold text-slate-600">Attempted</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-xs font-bold text-slate-600">Not Attempted</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-xs font-bold text-slate-600">Current</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-slate-100 border-2 border-slate-200 rounded-full"></div>
                    <span className="text-xs font-bold text-slate-500">Unvisited</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Exam Rules Card */}
            <div className={`rounded-3xl p-6 shadow-xl ${warningCount >= 2 ? 'bg-gradient-to-br from-red-600 to-red-700 shadow-red-100' : 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-100'} text-white`}>
               <h4 className="font-black text-lg mb-2 flex items-center gap-2">
                 <ShieldAlert size={20} />
                 Exam Rules
               </h4>
               <ul className="text-sm leading-relaxed opacity-90 space-y-2 mb-4">
                 <li>• Do <strong>NOT</strong> switch tabs or windows</li>
                 <li>• {MAX_WARNINGS} warnings = auto-submit</li>
                 <li>• Your progress is saved in real-time</li>
               </ul>
               {warningCount > 0 && (
                 <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                   <span className="text-xs font-black uppercase tracking-widest">
                     {warningCount}/{MAX_WARNINGS} Warnings Used
                   </span>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAttempt;