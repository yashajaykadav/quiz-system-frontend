import { useEffect, useState } from 'react';
import api from '../../api/axios';

const ContactQueries = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchQueries = async () => {
        try {
            const res = await api.get('/admin/contact');
            setQueries(res.data || []);
        } catch (err) {
            console.error("Error fetching queries", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueries();
    }, []);

    return (
        <div className="p-6 bg-[#eef2ff] min-h-screen font-sans text-black">
            {/* Header Section */}
            <div className="mb-10">
                <h2 className="text-3xl font-black uppercase tracking-tighter italic">
                    Student <span className="text-[#3b82f6]">Queries</span>
                </h2>
                <div className="h-1.5 w-20 bg-black mt-1"></div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-3">
                    Incoming Support Tickets & Inquiries
                </p>
            </div>

            {loading ? (
                <div className="p-12 border-2 border-black bg-white text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <p className="font-black uppercase tracking-widest animate-pulse text-gray-400">
                        Syncing Database...
                    </p>
                </div>
            ) : queries.length === 0 ? (
                <div className="p-12 border-2 border-dashed border-gray-400 bg-white/50 text-center">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                        No Pending Queries
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl">
                    {queries.map((q) => (
                        <div
                            key={q.id}
                            className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between hover:bg-[#f8fafc] transition-colors"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4 border-b-2 border-black pb-3">
                                    <div className="space-y-0.5">
                                        <p className="font-black text-sm uppercase tracking-tight leading-none">
                                            {q.name}
                                        </p>
                                        <p className="text-[10px] font-bold text-gray-500 lowercase">
                                            {q.email}
                                        </p>
                                    </div>
                                    <span className="font-mono text-[9px] font-bold text-gray-400 uppercase bg-gray-100 px-1.5 py-0.5 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                                        {q.createdAt}
                                    </span>
                                </div>

                                {/* Subject Tag */}
                                <div className="inline-block bg-[#3b82f6] text-white px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border border-black mb-3 italic">
                                    {q.subject}
                                </div>

                                {/* Message Block */}
                                <div className="bg-[#f1f5f9] border-l-4 border-black p-3 mb-4">
                                    <p className="text-xs font-bold leading-relaxed text-gray-800">
                                        {q.message}
                                    </p>
                                </div>
                            </div>

                            {/* Action Section */}
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => handleResolve(q.id)}
                                    className="group relative px-4 py-2 bg-[#22c55e] text-white text-[10px] font-black uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                                >
                                    Mark Resolved
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default ContactQueries;