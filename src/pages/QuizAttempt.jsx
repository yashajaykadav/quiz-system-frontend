// src/pages/QuizAttempt.jsx
import { useNavigate } from 'react-router-dom';
import { useQuizAttempt } from '../components/hooks/useQuizAttempt';
import Navbar from '../components/common/Navbar';
import QuizHeader from '../components/quiz/QuizHeader';
import QuestionCard from '../components/quiz/QuestionCard';
import QuestionNavigator from '../components/quiz/QuestionNavigator';
import ExamRulesCard from '../components/quiz/ExamRules';
import WarningModal from '../components/quiz/WarningModal';
import WarningBadge from '../components/quiz/WarningBadge';
import ConfirmModal from '../components/common/ConfirmModal';
import InfoModal from '../components/common/InfoModal';

const QuizAttempt = () => {
  const navigate = useNavigate();
  const {
    attempt,
    quizMeta,
    questions,
    answers,
    currentQuestionIndex,
    loading,
    warningCount,
    showWarningModal,
    autoSubmitted,
    infoModal,
    confirmModal,
    startedAt,
    setCurrentQuestionIndex,
    handleAnswerSelect,
    handleTimeUp,
    submitQuiz,
    dismissWarning,
    getQuestionStatus,
    MAX_WARNINGS,
  } = useQuizAttempt();

  // ── Loading ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="border-4 border-black bg-white px-10 py-8 shadow-[6px_6px_0px_0px_#000] text-center">
            <div className="w-10 h-10 border-4 border-black border-t-yellow-400 rounded-full animate-spin mx-auto mb-4" />
            <p className="font-black uppercase tracking-widest text-black text-sm">
              Preparing your quiz…
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────
  if (!attempt || questions.length === 0) {
    return (
      <div className="min-h-screen bg-yellow-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000] text-center max-w-md w-full">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-black text-black uppercase mb-2">
              No Questions Found
            </h2>
            <p className="text-gray-700 font-bold mb-6">
              This quiz has no questions or failed to load.
            </p>
            <button
              onClick={() => navigate('/student')}
              className="
                w-full bg-black text-white py-3 font-black uppercase tracking-widest
                border-4 border-black hover:bg-yellow-400 hover:text-black
                shadow-[4px_4px_0px_0px_#000] transition-colors
              "
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion.id);

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col font-sans">
      <Navbar />

      {/* ── Global modals ──────────────────────────────────────────────── */}
      {infoModal && <InfoModal    {...infoModal} />}
      {confirmModal && <ConfirmModal {...confirmModal} />}

      {showWarningModal && (
        <WarningModal
          warningCount={warningCount}
          autoSubmitted={autoSubmitted}
          onDismiss={dismissWarning}
        />
      )}

      <WarningBadge warningCount={warningCount} maxWarnings={MAX_WARNINGS} />

      {/* ── Page body ──────────────────────────────────────────────────── */}
      <div className="flex-1 w-full px-4 md:px-6 py-6 max-w-7xl mx-auto">
        <QuizHeader
          quizMeta={quizMeta}
          startedAt={startedAt}
          onTimeUp={handleTimeUp}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            <QuestionCard
              question={currentQuestion}
              questionIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              currentAnswer={currentAnswer}
              onAnswerSelect={handleAnswerSelect}
              onPrev={() => setCurrentQuestionIndex((i) => i - 1)}
              onNext={() => setCurrentQuestionIndex((i) => i + 1)}
              onSubmit={submitQuiz}
              isFirst={currentQuestionIndex === 0}
              isLast={currentQuestionIndex === questions.length - 1}
            />
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <QuestionNavigator
              questions={questions}
              getQuestionStatus={getQuestionStatus}
              onNavigate={setCurrentQuestionIndex}
              currentIndex={currentQuestionIndex}
            />
            <ExamRulesCard
              warningCount={warningCount}
              maxWarnings={MAX_WARNINGS}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAttempt;