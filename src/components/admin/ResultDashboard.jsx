import { useState, useEffect } from 'react';

import { adminApi } from '../../api/adminApi';

const ResultsDashboard = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await adminApi.getAllResults();
                console.log('Results:', res.data);
                setResults(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error('Error:', err.response?.status, err.response?.data);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    const totalAttempts = results.length;
    const avgPercentage = totalAttempts > 0
        ? (results.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / totalAttempts).toFixed(1)
        : 0;

    return (
        <div className="space-y-8 p-4 bg-yellow-50 min-h-screen font-mono text-black">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-black text-white border-4 border-black shadow-[6px_6px_0px_0px_#000]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                        Total Submissions
                    </p>
                    <h3 className="text-4xl font-black tracking-tight">
                        {totalAttempts}
                    </h3>
                </div>

                <div className="p-6 bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">
                        Class Average
                    </p>
                    <h3 className="text-4xl font-black text-black">
                        {avgPercentage}<span className="text-xl ml-1 text-yellow-500">%</span>
                    </h3>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-yellow-400 border-b-4 border-black">
                                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest border-r-4 border-black">
                                    Student
                                </th>
                                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest border-r-4 border-black">
                                    Quiz Details
                                </th>
                                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest border-r-4 border-black">
                                    Category
                                </th>
                                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-center border-r-4 border-black">
                                    Score
                                </th>
                                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-center border-r-4 border-black">
                                    %
                                </th>
                                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-right">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y-4 divide-black">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center">
                                        <div className="w-8 h-8 border-4 border-black border-t-yellow-400 animate-spin mx-auto mb-3" />
                                        <span className="font-black uppercase tracking-widest text-gray-400 text-xs">
                                            Loading...
                                        </span>
                                    </td>
                                </tr>
                            ) : results.length > 0 ? (
                                results.map((res, idx) => (
                                    <tr
                                        key={idx}
                                        className="hover:bg-yellow-50 transition-colors"
                                    >
                                        <td className="px-4 py-4 border-r-4 border-black">
                                            <div className="font-black text-sm uppercase">
                                                {res.studentName || 'Unknown'}
                                            </div>
                                            <div className="text-[10px] font-bold text-gray-500">
                                                {res.studentEmail}
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 border-r-4 border-black">
                                            <div className="font-black text-sm">{res.quizTitle}</div>
                                            <div className="text-[10px] text-gray-500 font-mono">
                                                {res.quizDate}
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 border-r-4 border-black">
                                            <div className="text-xs font-black uppercase">
                                                {res.subjectName}
                                            </div>
                                            <div className="text-[10px] text-gray-500">
                                                {res.topicName}
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 text-center font-mono font-black text-sm border-r-4 border-black">
                                            {res.obtainedMarks}
                                            <span className="text-gray-400"> / </span>
                                            {res.totalMarks}
                                        </td>

                                        <td className="px-4 py-4 text-center border-r-4 border-black">
                                            <span className="inline-block px-2 py-1 bg-black text-yellow-400 text-xs font-black">
                                                {res.percentage}%
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 text-right">
                                            <span
                                                className={`
                          inline-block px-3 py-1 text-[10px] font-black uppercase
                          border-4 border-black shadow-[2px_2px_0px_0px_#000]
                          ${res.status === 'PASS'
                                                        ? 'bg-green-400 text-black'
                                                        : 'bg-red-400 text-black'
                                                    }
                        `}
                                            >
                                                {res.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="p-12 text-center font-black uppercase text-gray-400"
                                    >
                                        No Records Found
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