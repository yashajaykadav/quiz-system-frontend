import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { studentApi } from '../api/studentApi';
import { Calendar, Clock, Award, ChevronRight, CheckCircle } from 'lucide-react';

const StudentDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [completedQuizIds, setCompletedQuizIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({
    message: '',
    type: '',
    visible: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const showToast = (message, type = 'error') => {
    setToast({ message, type, visible: true });

    setTimeout(() => {
      setToast({ message: '', type: '', visible: false });
    }, 3000);
  };

  const fetchDashboardData = async () => {
    try {
      const [quizzesRes, performanceRes] = await Promise.all([
        studentApi.getTodayQuizzes(),
        studentApi.getOverallPerformance()
      ]);
      
      setQuizzes(quizzesRes.data || []);
      
      const results = performanceRes.data?.results || [];
      const completedIds = new Set(
        results.filter(r => r.status === 'COMPLETED').map(r => r.quizId)
      );
      setCompletedQuizIds(completedIds);

    } catch (error) {
      showToast('Failed to fetch dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (quiz) => {
    if (completedQuizIds.has(quiz.id)) {
      showToast('You have already completed this test', 'error');
      return;
    }
    if (!isQuizAvailable(quiz)) {
      showToast('Quiz not available right now', 'error');
      return;
    }
    navigate(`/student/quiz/${quiz.id}`);
  };

  // 🔥 Availability logic
  const isQuizAvailable = (quiz) => {
    const now = new Date();
    const quizTime = new Date(quiz.scheduledDate);

    return now >= quizTime;
  };

  const getStatus = (quiz) => {
    if (completedQuizIds.has(quiz.id)) return 'COMPLETED';
    const now = new Date();
    const quizTime = new Date(quiz.scheduledDate);

    if (now < quizTime) return 'UPCOMING';
    return 'AVAILABLE';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* TOAST */}
      {toast.visible && (
        <div
          className={`fixed top-5 right-5 px-6 py-3 rounded-xl text-white shadow-lg z-50
            ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}
          `}
        >
          {toast.message}
        </div>
      )}

      <div className="flex-1 container mx-auto px-4 py-10 max-w-6xl">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">
              Welcome back!
            </h1>
            <p className="text-slate-500 font-medium">
              Here are your scheduled quizzes for today.
            </p>
          </div>

          <button
            onClick={() => navigate('/student/results')}
            className="flex items-center gap-3 bg-white border px-6 py-3 rounded-xl font-bold hover:shadow-md"
          >
            <Award className="text-blue-600" />
            View Performance
          </button>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <Calendar size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No quizzes scheduled today</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">

            {quizzes.map((quiz) => {
              const status = getStatus(quiz);
              const available = isQuizAvailable(quiz);
              const isCompleted = completedQuizIds.has(quiz.id);

              let statusClasses = 'bg-yellow-100 text-yellow-700';
              if (status === 'AVAILABLE') statusClasses = 'bg-green-100 text-green-700';
              if (status === 'COMPLETED') statusClasses = 'bg-blue-100 text-blue-700';

              return (
                <div
                  key={quiz.id}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition flex flex-col"
                >
                  {/* HEADER */}
                  <div className="flex justify-between mb-4">
                    <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-bold">
                      {quiz.subjectName}
                    </span>

                    <span
                      className={`text-xs px-3 py-1 rounded-lg font-bold ${statusClasses}`}
                    >
                      {status}
                    </span>
                  </div>

                  {/* TITLE */}
                  <h3 className="text-xl font-bold mb-2">
                    {quiz.title}
                  </h3>

                  <p className="text-gray-500 mb-4 text-sm mix-blend-multiply flex-grow">
                    {quiz.description}
                  </p>

                  {/* INFO */}
                  <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
                    <div>
                      <span className="text-gray-400">Topic</span>
                      <div className="font-semibold">{quiz.topicName}</div>
                    </div>

                    <div>
                      <span className="text-gray-400">Questions</span>
                      <div className="font-semibold">{quiz.totalQuestions}</div>
                    </div>

                    <div>
                      <span className="text-gray-400">Duration</span>
                      <div className="font-semibold">{quiz.durationMinutes} min</div>
                    </div>

                    <div>
                      <span className="text-gray-400">Time</span>
                      <div className="font-semibold">
                        {new Date(quiz.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>

                  {/* BUTTON */}
                  <button
                    onClick={() => startQuiz(quiz)}
                    disabled={!available || isCompleted}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition mt-auto
                      ${isCompleted 
                        ? 'bg-blue-50 text-blue-600 border border-blue-200 cursor-not-allowed'
                        : available
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                    `}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle size={18} />
                        Completed Test
                      </>
                    ) : available ? (
                      <>
                        Start Quiz
                        <ChevronRight size={18} />
                      </>
                    ) : (
                      'Not Available Yet'
                    )}
                  </button>
                </div>
              );
            })}

          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;