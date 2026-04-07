import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { studentApi } from '../api/studentApi';
import { TrendingUp, Award, Calendar, ChevronLeft } from 'lucide-react';

const OverallResults = () => {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    try {
      const response = await studentApi.getOverallPerformance();
      setPerformance(response.data);
    } catch (error) {
      alert('Failed to fetch results');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center h-screen">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-10 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Performance Analytics</h1>
            <p className="text-slate-500 font-medium tracking-tight">Comprehensive report of your quiz attempts and learning progress.</p>
          </div>
          <button
            onClick={() => navigate('/student')}
            className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-slate-200 hover:bg-black transition-all active:scale-95"
          >
            <ChevronLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
            Back to Dashboard
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-500"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Calendar size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Attempts</h3>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">{performance.totalQuizzesAttempted}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-500"></div>
             <div className="relative z-10">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Average Score</h3>
              <div className="flex items-baseline gap-1">
                <p className="text-4xl font-black text-slate-900 tracking-tighter">{performance.averageScore.toFixed(1)}</p>
                <span className="text-xl font-bold text-green-500">%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-500"></div>
             <div className="relative z-10">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                <Award size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Personal Best</h3>
              <div className="flex items-baseline gap-1">
                <p className="text-4xl font-black text-slate-900 tracking-tighter">{performance.bestScore.toFixed(1)}</p>
                <span className="text-xl font-bold text-amber-500">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Table Area */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-800">Historical Records</h3>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em]">
               Sorted by most recent
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50">
                  <th className="px-8 py-5 text-left font-black">Subject & Title</th>
                  <th className="px-8 py-5 text-left font-black">Topic</th>
                  <th className="px-8 py-5 text-left font-black">Attempt Date</th>
                  <th className="px-8 py-5 text-center font-black">Score Detail</th>
                  <th className="px-8 py-5 text-center font-black">Percentage</th>
                  <th className="px-8 py-5 text-center font-black">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {performance.results.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-20 text-center text-slate-400 font-medium italic">
                       No quiz attempts recorded yet.
                    </td>
                  </tr>
                ) : performance.results.map((result, index) => (
                  <tr key={index} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mb-1">{result.subjectName}</span>
                        <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{result.quizTitle}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">{result.topicName}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-medium text-slate-500">{result.quizDate}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-black text-slate-800">{result.obtainedMarks} / {result.totalMarks}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Raw Marks</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 group-hover:border-blue-100 group-hover:bg-blue-50 transition-colors relative overflow-hidden">
                        {/* Status ring indication */}
                        <div className={`absolute bottom-0 left-0 h-1 w-full ${result.percentage >= 60 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={`text-sm font-black ${result.percentage >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.round(result.percentage)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border ${
                          result.status === 'COMPLETED'
                            ? 'bg-green-50 border-green-100 text-green-700'
                            : 'bg-red-50 border-red-100 text-red-700'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${result.status === 'COMPLETED' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        {result.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Footer Decoration */}
          <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default OverallResults;