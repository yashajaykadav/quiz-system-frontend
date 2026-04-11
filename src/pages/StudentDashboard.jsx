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
    <div className="min-h-screen bg-yellow-50 flex flex-col font-mono">

      <Navbar />

      {/* TOAST */}
      {toast.visible && (
        <div
          className={`fixed top-4 right-4 px-5 py-3 border-2 border-black text-black text-sm z-50
        ${toast.type === 'error' ? 'bg-red-400' : 'bg-green-400'}`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex-1 px-6 py-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b-2 border-black pb-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              STUDENT DASHBOARD
            </h1>
            <p className="text-sm text-gray-700 font-semibold">
              Available quizzes
            </p>
          </div>

          <button
            onClick={() => navigate('/student/results')}
            className="flex items-center gap-2 border-2 border-black px-4 py-2 text-sm font-bold bg-white hover:bg-black hover:text-white transition"
          >
            <Award size={18} />
            RESULTS
          </button>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-black border-t-transparent animate-spin" />
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-16 bg-white border-2 border-black">
            <Calendar size={36} className="mx-auto mb-3" />
            <p className="text-sm font-bold">
              NO QUIZZES AVAILABLE
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {quizzes.map((quiz) => {
              const status = getStatus(quiz);
              const available = isQuizAvailable(quiz);
              const isCompleted = completedQuizIds.has(quiz.id);

              let statusClasses = 'bg-yellow-300';
              if (status === 'AVAILABLE') statusClasses = 'bg-green-400';
              if (status === 'COMPLETED') statusClasses = 'bg-blue-400';

              return (
                <div
                  key={quiz.id}
                  className="bg-white border-2 border-black p-5 flex flex-col shadow-[6px_6px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] transition"
                >
                  {/* TOP */}
                  <div className="flex justify-between mb-3">
                    <span className="text-xs px-2 py-1 border border-black font-bold bg-gray-100">
                      {quiz.subjectName}
                    </span>

                    <span className={`text-xs px-2 py-1 border border-black font-bold ${statusClasses}`}>
                      {status}
                    </span>
                  </div>

                  {/* TITLE */}
                  <h3 className="text-lg font-black mb-1 uppercase">
                    {quiz.title}
                  </h3>

                  <p className="text-sm text-gray-700 mb-3 flex-grow font-medium">
                    {quiz.description}
                  </p>

                  {/* INFO */}
                  <div className="text-sm font-bold space-y-1 mb-4">
                    <div>TOPIC: {quiz.topicName}</div>
                    <div>Q: {quiz.totalQuestions}</div>
                    <div>TIME: {quiz.durationMinutes} MIN</div>
                    <div>
                      AT: {new Date(quiz.scheduledDate).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>

                  {/* BUTTON */}
                  <button
                    onClick={() => startQuiz(quiz)}
                    disabled={!available || isCompleted}
                    className={`w-full py-2 text-sm font-black border-2 border-black transition
                  ${isCompleted
                        ? 'bg-blue-300'
                        : available
                          ? 'bg-black text-white hover:bg-white hover:text-black'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                  >
                    {isCompleted
                      ? 'COMPLETED'
                      : available
                        ? 'START QUIZ'
                        : 'LOCKED'}
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