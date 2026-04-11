import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import SubjectForm from '../components/admin/SubjectForm';
import TopicForm from '../components/admin/TopicForm';
import QuestionForm from '../components/admin/QuestionForm';
import QuizForm from '../components/admin/QuizForm';
import StudentManagement from '../components/admin/StudentManagement';
import ResultsDashboard from '../components/admin/ResultDashboard';
import ContactQueries from '../components/admin/ContactQueries';
import api from '../api/axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('subjects');

  // ✅ STATS STATE
  const [stats, setStats] = useState({
    subjects: 0,
    topics: 0,
    questions: 0,
    students: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  const tabs = [
    { id: 'subjects', label: 'Subjects' },
    { id: 'topics', label: 'Topics' },
    { id: 'questions', label: 'Questions' },
    { id: 'quizzes', label: 'Quizzes' },
    { id: 'students', label: 'Student Management' },
    { id: 'results', label: 'Quiz Results' },
    { id: 'queries', label: 'Student Queries' },
  ];

  // ✅ FETCH STATS FROM BACKEND
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      setStatsError(null);

      // Single dedicated endpoint (recommended)
      const res = await api.get('/admin/stats');
      /*
        Expected response shape from Spring Boot:
        {
          "subjects":  12,
          "topics":    34,
          "questions": 210,
          "students":  56
        }
      */
      setStats({
        subjects: res.data.subjects ?? 0,
        topics: res.data.topics ?? 0,
        questions: res.data.questions ?? 0,
        students: res.data.students ?? 0,
      });

    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setStatsError('Could not load stats');
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchStats();
  }, []);

  // ✅ Refresh stats whenever user switches tabs
  // (so adding a subject and going back to dashboard updates the count)
  useEffect(() => {
    fetchStats();
  }, [activeTab]);

  // ✅ STAT CARD CONFIG
  const statCards = [
    {
      label: 'Subjects',
      value: stats.subjects,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      icon: '📚',
    },
    {
      label: 'Topics',
      value: stats.topics,
      color: 'text-green-600',
      bg: 'bg-green-50',
      icon: '📖',
    },
    {
      label: 'Questions',
      value: stats.questions,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      icon: '❓',
    },
    {
      label: 'Students',
      value: stats.students,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      icon: '🎓',
    },
  ];

  return (
    <div className="min-h-screen bg-yellow-100 text-black flex font-mono">

      {/* ══════════ SIDEBAR ══════════ */}
      <div className="w-64 bg-white border-r-4 border-black flex flex-col">

        <div className="p-6 border-b-4 border-black">
          <h1 className="text-xl font-black">QUIZ ADMIN</h1>
          <p className="text-xs">CONTROL PANEL</p>
        </div>

        <div className="flex-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-5 py-3 border-b-2 border-black font-bold transition
                ${isActive
                    ? 'bg-red-500 text-white'
                    : 'bg-white hover:bg-black hover:text-white'}
              `}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <div className="flex-1 flex flex-col">

        <Navbar />

        <div className="p-6 flex-1 flex flex-col">

          {/* ── HEADER ── */}
          <div className="mb-6 flex justify-between items-center border-b-4 border-black pb-3">
            <div>
              <h1 className="text-2xl font-black uppercase">
                {tabs.find(t => t.id === activeTab)?.label}
              </h1>
              <p className="text-xs">
                MANAGE SYSTEM DATA
              </p>
            </div>

            <button
              onClick={fetchStats}
              disabled={statsLoading}
              className="border-2 border-black px-4 py-1 font-bold text-sm
                       active:translate-y-1 hover:bg-black hover:text-white"
            >
              {statsLoading ? 'LOADING...' : 'REFRESH'}
            </button>
          </div>

          {/* ── STATS ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

            {statCards.map((card) => (
              <div
                key={card.label}
                className="border-4 border-black p-4 bg-white"
              >
                <p className="text-[10px] uppercase font-bold">
                  {card.label}
                </p>

                {statsLoading ? (
                  <p className="text-lg font-black mt-2">...</p>
                ) : statsError ? (
                  <p className="text-red-600 font-black">ERR</p>
                ) : (
                  <p className="text-2xl font-black mt-1">
                    {card.value}
                  </p>
                )}
              </div>
            ))}

          </div>

          {/* ERROR */}
          {statsError && !statsLoading && (
            <div className="border-4 border-red-600 bg-red-200 p-3 mb-4 font-bold">
              ⚠ ERROR: {statsError}
              <button
                onClick={fetchStats}
                className="ml-4 underline"
              >
                RETRY
              </button>
            </div>
          )}

          {/* ── MAIN BOX ── */}
          <div className="border-4 border-black bg-white flex-1 overflow-y-auto p-6">

            {activeTab === 'subjects' && <SubjectForm />}
            {activeTab === 'topics' && <TopicForm />}
            {activeTab === 'questions' && <QuestionForm />}
            {activeTab === 'quizzes' && <QuizForm />}
            {activeTab === 'students' && <StudentManagement />}
            {activeTab === 'results' && <ResultsDashboard />}
            {activeTab === 'queries' && <ContactQueries />}

          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;