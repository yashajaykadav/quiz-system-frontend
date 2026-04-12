import { useEffect, useState } from 'react';
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
  const [activeTab, setActiveTab] = useState('dashboard');

  const [stats, setStats] = useState({
    subjects: 0,
    topics: 0,
    questions: 0,
    students: 0,
  });
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState(null);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'subjects', label: 'Subjects' },
    { id: 'topics', label: 'Topics' },
    { id: 'questions', label: 'Questions' },
    { id: 'quizzes', label: 'Quizzes' },
    { id: 'students', label: 'Students' },
    { id: 'results', label: 'Results' },
    { id: 'queries', label: 'Queries' },
  ];

  const statCards = [
    { label: 'Subjects', value: stats.subjects },
    { label: 'Topics', value: stats.topics },
    { label: 'Questions', value: stats.questions },
    { label: 'Students', value: stats.students },
  ];

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      setStatsError(null);
      const res = await api.get('/admin/stats');
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

  useEffect(() => {
    if (activeTab === 'dashboard') fetchStats();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Navbar />

      <div className="p-6 space-y-6">
        {/* Top Header + Tabs */}
        <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="p-5 border-b-[4px] border-black flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight">
                Quiz Admin
              </h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase">
                Control Panel
              </p>
            </div>

            {activeTab === 'dashboard' && (
              <button
                onClick={fetchStats}
                disabled={statsLoading}
                className="px-4 py-2 border-[3px] border-black font-black text-xs uppercase
                           bg-white hover:bg-yellow-300 transition-colors
                           shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                           active:shadow-none active:translate-x-[2px] active:translate-y-[2px]
                           disabled:opacity-40"
              >
                {statsLoading ? 'Loading...' : '↻ Refresh Stats'}
              </button>
            )}
          </div>

          {/* Tabs row */}
          <div className="flex flex-wrap">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 border-r-[2px] border-black border-b-[2px] font-black uppercase text-xs tracking-widest transition-colors
                    ${isActive ? 'bg-black text-yellow-300' : 'bg-white hover:bg-yellow-300'}`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Page Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h2>
        </div>

        {/* Content */}
        <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {statsError && (
                <div className="border-[3px] border-red-600 bg-red-100 p-3 font-bold text-sm flex items-center gap-4">
                  ⚠ {statsError}
                  <button onClick={fetchStats} className="underline text-red-700">
                    Retry
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map((card) => (
                  <div
                    key={card.label}
                    className="bg-white border-[4px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-5"
                  >
                    <p className="text-xs font-black uppercase tracking-widest text-gray-500">
                      {card.icon} {card.label}
                    </p>
                    <p className="text-4xl font-black mt-3">
                      {statsLoading ? '...' : card.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

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
  );
};

export default AdminDashboard;