import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { studentApi } from '../api/studentApi';
import { Calendar, Award } from 'lucide-react';

const StudentDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [completedQuizIds, setCompletedQuizIds] = useState(new Set());
  const [inProgressQuizIds, setInProgressQuizIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: '', visible: false });

  const navigate = useNavigate();

  useEffect(() => { fetchDashboardData(); }, []);

  const showToast = (message, type = 'error') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ message: '', type: '', visible: false }), 3000);
  };

  const fetchDashboardData = async () => {
    try {
      const [quizzesRes, performanceRes] = await Promise.all([
        studentApi.getTodayQuizzes(),
        studentApi.getOverallPerformance(),
      ]);

      console.log('Quizzes:', quizzesRes.data);
      console.log('Performance:', performanceRes.data);

      setQuizzes(quizzesRes.data || []);

      // ── Extract results from confirmed shape: { results: [...] } ────
      const results = performanceRes.data?.results ?? [];

      // ── Build sets for COMPLETED and IN_PROGRESS quizzes ────────────
      const completedIds = new Set();
      const inProgressIds = new Set();

      results.forEach((r) => {
        if (r.status === 'COMPLETED') completedIds.add(r.quizId);
        if (r.status === 'IN_PROGRESS') inProgressIds.add(r.quizId);
      });

      console.log('Completed IDs:', [...completedIds]);
      console.log('In-Progress IDs:', [...inProgressIds]);

      setCompletedQuizIds(completedIds);
      setInProgressQuizIds(inProgressIds);

    } catch (error) {
      console.error('Dashboard error:', error.response?.data || error.message);
      showToast('Failed to fetch dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── Quiz helpers ───────────────────────────────────────────────────────
  const isQuizAvailable = (quiz) => new Date() >= new Date(quiz.scheduledDate);

  const getStatus = (quiz) => {
    if (completedQuizIds.has(quiz.id)) return 'COMPLETED';
    if (inProgressQuizIds.has(quiz.id)) return 'IN_PROGRESS';
    if (!isQuizAvailable(quiz)) return 'UPCOMING';
    return 'AVAILABLE';
  };

  const handleQuizAction = (quiz) => {
    const status = getStatus(quiz);

    if (status === 'COMPLETED') {
      showToast('You have already completed this test', 'error');
      return;
    }

    if (status === 'UPCOMING') {
      showToast('Quiz not available yet', 'error');
      return;
    }

    // Both AVAILABLE and IN_PROGRESS → navigate to quiz
    navigate(`/student/quiz/${quiz.id}`);
  };

  // ── Button config based on status ──────────────────────────────────────
  const getButtonConfig = (status) => {
    switch (status) {
      case 'COMPLETED':
        return {
          label: '✓ COMPLETED',
          disabled: true,
          className: 'bg-blue-300 text-black cursor-not-allowed',
        };
      case 'IN_PROGRESS':
        return {
          label: '↻ RESUME QUIZ',
          disabled: false,
          className: 'bg-yellow-400 text-black hover:bg-yellow-500 cursor-pointer shadow-[3px_3px_0px_0px_#666]',
        };
      case 'UPCOMING':
        return {
          label: '🔒 LOCKED',
          disabled: true,
          className: 'bg-gray-200 text-gray-500 cursor-not-allowed',
        };
      default: // AVAILABLE
        return {
          label: 'START QUIZ →',
          disabled: false,
          className: 'bg-black text-white hover:bg-yellow-400 hover:text-black cursor-pointer shadow-[3px_3px_0px_0px_#666]',
        };
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-blue-400';
      case 'IN_PROGRESS': return 'bg-yellow-400';
      case 'AVAILABLE': return 'bg-green-400';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col font-mono">
      <Navbar />

      {/* Toast */}
      {toast.visible && (
        <div className={`
          fixed top-4 right-4 z-50 px-5 py-3
          border-4 border-black font-bold text-sm
          shadow-[4px_4px_0px_0px_#000]
          ${toast.type === 'error' ? 'bg-red-400 text-black' : 'bg-green-400 text-black'}
        `}>
          {toast.message}
        </div>
      )}

      <div className="flex-1 px-6 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b-4 border-black pb-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">STUDENT DASHBOARD</h1>
            <p className="text-sm text-gray-700 font-bold">Available quizzes for today</p>
          </div>
          <button
            onClick={() => navigate('/student/results')}
            className="
              flex items-center gap-2 border-4 border-black px-4 py-2
              text-sm font-black bg-white
              shadow-[4px_4px_0px_0px_#000]
              hover:bg-black hover:text-white transition-colors
            "
          >
            <Award size={18} /> RESULTS
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-black border-t-yellow-400 animate-spin" />
          </div>

        ) : quizzes.length === 0 ? (
          <div className="text-center py-16 bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000]">
            <Calendar size={36} className="mx-auto mb-3" />
            <p className="text-sm font-black uppercase">No Quizzes Available Today</p>
          </div>

        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => {
              const status = getStatus(quiz);
              const btnConfig = getButtonConfig(status);

              return (
                <div
                  key={quiz.id}
                  className="
                    bg-white border-4 border-black p-5 flex flex-col
                    shadow-[6px_6px_0px_0px_#000]
                    hover:-translate-x-1 hover:-translate-y-1 transition-transform
                  "
                >
                  {/* Top row */}
                  <div className="flex justify-between mb-3">
                    <span className="text-xs px-2 py-1 border-2 border-black font-black bg-gray-100">
                      {quiz.subjectName}
                    </span>
                    <span className={`
                      text-xs px-2 py-1 border-2 border-black font-black
                      ${getStatusBadgeColor(status)}
                    `}>
                      {status === 'IN_PROGRESS' ? 'IN PROGRESS' : status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-black mb-1 uppercase">{quiz.title}</h3>
                  <p className="text-sm text-gray-700 mb-3 flex-grow font-medium">
                    {quiz.description}
                  </p>

                  {/* Info */}
                  <div className="text-xs font-black space-y-1 mb-4 border-t-2 border-dashed border-black pt-3">
                    <div>TOPIC: {quiz.topicName}</div>
                    <div>QUESTIONS: {quiz.totalQuestions}</div>
                    <div>DURATION: {quiz.durationMinutes} MIN</div>
                    <div>
                      TIME:{' '}
                      {new Date(quiz.scheduledDate).toLocaleTimeString([], {
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </div>
                  </div>

                  {/* Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (btnConfig.disabled) return;
                      handleQuizAction(quiz);
                    }}
                    disabled={btnConfig.disabled}
                    className={`
                      w-full py-2 text-sm font-black border-4 border-black transition-colors
                      ${btnConfig.className}
                    `}
                  >
                    {btnConfig.label}
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