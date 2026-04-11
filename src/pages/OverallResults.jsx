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
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-black border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#eef2ff] flex flex-col font-sans text-black">
      <Navbar />

      <div className="flex-1 px-6 py-10 max-w-6xl mx-auto w-full">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">
              Performance <span className="text-[#3b82f6]">Analytics</span>
            </h1>
            <div className="h-1.5 w-20 bg-black mt-1"></div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-3">
              Metric Tracking & Progress Logs
            </p>
          </div>

          <button
            onClick={() => navigate('/student')}
            className="flex items-center gap-2 bg-white border-2 border-black px-5 py-2 text-sm font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <ChevronLeft size={18} strokeWidth={3} />
            Back to Portal
          </button>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Total Attempts */}
          <div className="bg-[#dbeafe] border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-800 mb-2">Total Attempts</p>
            <h3 className="text-4xl font-black italic">{performance.totalQuizzesAttempted}</h3>
          </div>

          {/* Average Score */}
          <div className="bg-[#bbf7d0] border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-800 mb-2">Avg. Efficiency</p>
            <h3 className="text-4xl font-black italic">{performance.averageScore.toFixed(1)}%</h3>
          </div>

          {/* Best Score */}
          <div className="bg-[#fef08a] border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-800 mb-2">Peak Performance</p>
            <h3 className="text-4xl font-black italic">{performance.bestScore.toFixed(1)}%</h3>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="px-5 py-4 border-b-2 border-black bg-white flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-widest">
              Attempt History Log
            </h3>
            <span className="bg-black text-white text-[10px] px-2 py-0.5 font-bold uppercase italic">
              Sort: Chronological
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] border-b-2 border-black">
                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-left border-r-2 border-black">Quiz Asset</th>
                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-left border-r-2 border-black">Topic</th>
                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-left border-r-2 border-black">Date</th>
                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-center border-r-2 border-black">Score</th>
                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-center border-r-2 border-black">Accuracy</th>
                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-center">Outcome</th>
                </tr>
              </thead>

              <tbody className="divide-y-2 divide-black">
                {performance.results.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-16 font-bold uppercase tracking-widest text-gray-400">
                      No session data available
                    </td>
                  </tr>
                ) : (
                  performance.results.map((r, i) => (
                    <tr key={i} className="hover:bg-[#f0f9ff] transition-colors">
                      <td className="px-5 py-5 border-r-2 border-black">
                        <div className="font-black text-sm uppercase tracking-tight">{r.quizTitle}</div>
                        <div className="text-[10px] font-bold text-[#3b82f6] uppercase">{r.subjectName}</div>
                      </td>

                      <td className="px-5 py-5 border-r-2 border-black font-bold text-gray-700">
                        {r.topicName}
                      </td>

                      <td className="px-5 py-5 border-r-2 border-black font-mono text-xs font-bold text-gray-500">
                        {r.quizDate}
                      </td>

                      <td className="px-5 py-5 text-center border-r-2 border-black">
                        <span className="font-black text-sm">
                          {r.obtainedMarks} <span className="text-gray-300">/</span> {r.totalMarks}
                        </span>
                      </td>

                      <td className="px-5 py-5 text-center border-r-2 border-black">
                        <span className={`text-sm font-black italic ${r.percentage >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.round(r.percentage)}%
                        </span>
                      </td>

                      <td className="px-5 py-5 text-center">
                        <span className={`inline-block px-3 py-1 text-[10px] font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${r.status === 'COMPLETED' ? 'bg-[#bbf7d0]' : 'bg-[#fecaca]'
                          }`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallResults;