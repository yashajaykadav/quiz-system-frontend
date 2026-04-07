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

    // Helper calculations for Summary Cards
    const totalAttempts = results.length;
    const avgPercentage = totalAttempts > 0
        ? (results.reduce((acc, curr) => acc + curr.percentage, 0) / totalAttempts).toFixed(1)
        : 0;

    return (
        <div className="space-y-8">
            {/* --- SUMMARY CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white shadow-xl shadow-blue-100">
                    <p className="text-blue-100 font-bold text-xs uppercase tracking-widest">Total Submissions</p>
                    <h3 className="text-4xl font-black mt-2">{totalAttempts}</h3>
                </div>
                <div className="p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Class Average</p>
                    <h3 className="text-4xl font-black mt-2 text-slate-900">{avgPercentage}%</h3>
                </div>
            </div>

            {/* --- RESULTS TABLE --- */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase">Student</th>
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase">Quiz & Date</th>
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase">Subject / Topic</th>
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase text-center">Score</th>
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase text-center">Percentage</th>
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan="6" className="p-10 text-center text-slate-400 font-medium">Loading analysis...</td></tr>
                        ) : results.length > 0 ? (
                            results.map((res, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                    {/* NEW: Student Column */}
                                    <td className="px-6 py-5">
                                        <div className="font-bold text-slate-900">{res.studentName || 'Unknown Student'}</div>
                                        <div className="text-xs text-slate-400">{res.studentEmail || 'N/A'}</div>
                                    </td>

                                    <td className="px-6 py-5">
                                        <div className="font-bold text-slate-700">{res.quizTitle}</div>
                                        <div className="text-xs text-slate-400">{res.quizDate}</div>
                                    </td>

                                    <td className="px-6 py-5">
                                        <span className="text-[10px] font-black bg-blue-50 px-2 py-1 rounded text-blue-600 uppercase mr-2 tracking-tighter">
                                            {res.subjectName}
                                        </span>
                                        <span className="text-xs text-slate-500 font-medium">{res.topicName}</span>
                                    </td>

                                    <td className="px-6 py-5 text-center font-bold text-slate-700">
                                        {res.obtainedMarks} <span className="text-slate-300">/</span> {res.totalMarks}
                                    </td>

                                    <td className="px-6 py-5 text-center">
                                        <span className="font-black text-blue-600 text-lg">{res.percentage}%</span>
                                    </td>

                                    <td className="px-6 py-5 text-right">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                                            ${res.status === 'PASS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {res.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" className="p-10 text-center text-slate-400 font-medium">No results found in the system.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ResultsDashboard;