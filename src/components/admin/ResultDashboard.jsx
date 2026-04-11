import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8081';

const ResultsDashboard = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAuthHeader = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/admin/results/all`, getAuthHeader());
                setResults(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Error fetching results", err);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    const totalAttempts = results.length;
    const avgPercentage = totalAttempts > 0
        ? (results.reduce((acc, curr) => acc + curr.percentage, 0) / totalAttempts).toFixed(1)
        : 0;

    return (
        <div className="space-y-8 p-4 bg-[#eef2ff] min-h-screen font-sans text-black">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Primary Card */}
                <div className="p-6 bg-[#3b82f6] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100 mb-1">
                        Total Submissions
                    </p>
                    <h3 className="text-4xl font-black text-white italic tracking-tighter">
                        {totalAttempts}
                    </h3>
                </div>

                {/* Secondary Card */}
                <div className="p-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">
                        Class Average
                    </p>
                    <h3 className="text-4xl font-black text-black">
                        {avgPercentage}<span className="text-xl ml-1 text-[#3b82f6]">%</span>
                    </h3>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#dbeafe] border-b-2 border-black">
                                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest border-r-2 border-black">Student</th>
                                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest border-r-2 border-black">Quiz Details</th>
                                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest border-r-2 border-black">Categorization</th>
                                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-center border-r-2 border-black">Score</th>
                                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-center border-r-2 border-black">%</th>
                                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-right">Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y-2 divide-black">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center font-bold uppercase tracking-widest text-gray-400">
                                        Initializing Data...
                                    </td>
                                </tr>
                            ) : results.length > 0 ? (
                                results.map((res, idx) => (
                                    <tr key={idx} className="hover:bg-[#f0f9ff] transition-colors group">
                                        <td className="px-4 py-4 border-r-2 border-black">
                                            <div className="font-black text-sm uppercase tracking-tight">{res.studentName || 'Unknown'}</div>
                                            <div className="text-[10px] font-bold text-gray-500 lowercase">{res.studentEmail}</div>
                                        </td>

                                        <td className="px-4 py-4 border-r-2 border-black">
                                            <div className="font-bold text-sm">{res.quizTitle}</div>
                                            <div className="text-[10px] text-gray-400 font-mono italic">{res.quizDate}</div>
                                        </td>

                                        <td className="px-4 py-4 border-r-2 border-black">
                                            <div className="text-xs font-black uppercase">{res.subjectName}</div>
                                            <div className="text-[10px] text-gray-500 tracking-tighter">{res.topicName}</div>
                                        </td>

                                        <td className="px-4 py-4 text-center font-mono font-bold text-sm border-r-2 border-black">
                                            {res.obtainedMarks} <span className="text-gray-400">/</span> {res.totalMarks}
                                        </td>

                                        <td className="px-4 py-4 text-center border-r-2 border-black">
                                            <span className="inline-block px-2 py-1 bg-black text-white text-xs font-black">
                                                {res.percentage}%
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 text-right">
                                            <span
                                                className={`inline-block px-3 py-1 text-[10px] font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${res.status === 'PASS'
                                                    ? 'bg-[#bbf7d0] text-black'
                                                    : 'bg-[#fecaca] text-black'
                                                    }`}
                                            >
                                                {res.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center font-bold uppercase text-gray-400">
                                        Zero Records Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


export default ResultsDashboard;