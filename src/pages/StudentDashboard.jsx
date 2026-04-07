import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { studentApi } from '../api/studentApi';
import { Calendar, Clock, Award, ChevronRight } from 'lucide-react';

const StudentDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({
    message: '',
    type: '',
    visible: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchTodayQuizzes();
  }, []);

  const showToast = (message, type = 'error') => {
    setToast({ message, type, visible: true });

    setTimeout(() => {
      setToast({ message: '', type: '', visible: false });
    }, 3000);
  };

  const fetchTodayQuizzes = async () => {
    try {
      const response = await studentApi.getTodayQuizzes();
      setQuizzes(response.data || []);
    } catch (error) {
      showToast('Failed to fetch quizzes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (quiz) => {
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

              return (
                <div
                  key={quiz.id}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
                >
                  {/* HEADER */}
                  <div className="flex justify-between mb-4">
                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-bold">
                      {quiz.subjectName}
                    </span>

                    <span
                      className={`text-xs px-3 py-1 rounded-lg font-bold
                        ${status === 'AVAILABLE'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'}
                      `}
                    >
                      {status}
                    </span>
                  </div>

                  {/* TITLE */}
                  <h3 className="text-xl font-bold mb-2">
                    {quiz.title}
                  </h3>

                  <p className="text-gray-500 mb-4 text-sm">
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
                        {new Date(quiz.scheduledDate).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>

                  {/* BUTTON */}
                  <button
                    onClick={() => startQuiz(quiz)}
                    disabled={!available}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition
                      ${available
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                    `}
                  >
                    {available ? 'Start Quiz' : 'Not Available'}
                    <ChevronRight size={16} />
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