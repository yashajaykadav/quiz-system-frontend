import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import SubjectForm from '../components/admin/SubjectForm';
import TopicForm from '../components/admin/TopicForm';
import QuestionForm from '../components/admin/QuestionForm';
import QuizForm from '../components/admin/QuizForm';
import StudentManagement from '../components/admin/StudentManagement';
import ResultsDashboard from '../components/admin/ResultDashboard';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('subjects');

  const tabs = [
    { id: 'subjects', label: 'Subjects' },
    { id: 'topics', label: 'Topics' },
    { id: 'questions', label: 'Questions' },
    { id: 'quizzes', label: 'Quizzes' },
    { id: 'students', label: 'Student Management' }, // Added
    { id: 'results', label: 'Quiz Results' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-10 max-w-6xl">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Management Center</h1>
          <p className="text-slate-500 font-medium tracking-tight">Configure subjects, topics, questions, and scheduled quizzes.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden min-h-[600px] flex flex-col">
          <div className="flex p-2 bg-slate-50/50 border-b border-slate-100 gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-4 rounded-2xl font-bold text-sm tracking-tight transition-all duration-200 whitespace-nowrap
                    ${isActive
                      ? 'bg-white text-blue-600 shadow-sm border border-slate-200 translate-y-0'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-10 flex-1 bg-white">
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === 'subjects' && <SubjectForm />}
              {activeTab === 'topics' && <TopicForm />}
              {activeTab === 'questions' && <QuestionForm />}
              {activeTab === 'quizzes' && <QuizForm />}
              {activeTab === 'students' && <StudentManagement />}
              {activeTab === 'results' && <ResultsDashboard />}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;