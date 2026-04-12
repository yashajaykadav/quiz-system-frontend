import { useEffect, useState } from 'react';
import { Trash2, CheckCircle } from 'lucide-react';
import api from '../../api/axios';

const ContactQueries = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchQueries = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/contact');
            setQueries(res.data || []);
        } catch (err) {
            console.error("Error fetching queries", err);
            setQueries([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueries();
    }, []);

    const handleResolve = async (id) => {
        try {
            await api.patch(`/admin/contact/${id}/resolve`);
            // backend sets status = "RESOLVED", mirror that locally
            setQueries(prev =>
                prev.map(q => q.id === id ? { ...q, status: 'RESOLVED' } : q)
            );
        } catch (err) {
            alert('Failed to mark as resolved');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Remove this query permanently?')) return;
        try {
            await api.delete(`/admin/contact/${id}`);
            setQueries(prev => prev.filter(q => q.id !== id));
        } catch (err) {
            alert('Failed to delete query');
        }
    };

    // status field is a string — "RESOLVED" or anything else = pending
    const isResolved = (q) => q.status === 'RESOLVED';

    const filtered = queries.filter(q => {
        if (filter === 'pending') return !isResolved(q);
        if (filter === 'resolved') return isResolved(q);
        return true;
    });

    const pendingCount = queries.filter(q => !isResolved(q)).length;
    const resolvedCount = queries.filter(q => isResolved(q)).length;

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                    Student Queries
                    <span className="text-sm font-normal text-gray-500 ml-2">
                        ({queries.length} total)
                    </span>
                </h2>
                <button
                    onClick={fetchQueries}
                    className="px-4 py-2 border-[3px] border-black font-black text-xs uppercase
                               bg-white hover:bg-yellow-300 transition-colors
                               shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                               active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                >
                    ↻ Refresh
                </button>
            </div>

            {/* FILTER TABS */}
            <div className="flex gap-3 flex-wrap">
                {[
                    { id: 'all', label: `All (${queries.length})`, bg: 'bg-white' },
                    { id: 'pending', label: `Pending (${pendingCount})`, bg: 'bg-yellow-300' },
                    { id: 'resolved', label: `Resolved (${resolvedCount})`, bg: 'bg-lime-400' },
                ].map((btn) => (
                    <button
                        key={btn.id}
                        onClick={() => setFilter(btn.id)}
                        className={`px-4 py-2 border-[3px] border-black font-black text-xs uppercase transition-all
                            ${filter === btn.id
                                ? `${btn.bg} shadow-none translate-x-[2px] translate-y-[2px]`
                                : 'bg-white hover:bg-gray-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'}`}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>

            {/* TABLE */}
            <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block animate-spin h-10 w-10 border-[4px] border-black border-b-yellow-400 mr-4" />
                        <span className="font-black text-xl uppercase">Loading Queries...</span>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-yellow-300 border-b-[4px] border-black">
                                <th className="px-6 py-4 font-black uppercase text-sm border-r-[4px] border-black">Sender</th>
                                <th className="px-6 py-4 font-black uppercase text-sm border-r-[4px] border-black">Subject</th>
                                <th className="px-6 py-4 font-black uppercase text-sm border-r-[4px] border-black">Message</th>
                                <th className="px-6 py-4 font-black uppercase text-sm border-r-[4px] border-black">Status</th>
                                <th className="px-6 py-4 font-black uppercase text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-[4px] divide-black">
                            {filtered.length > 0 ? filtered.map((q) => (
                                <tr
                                    key={q.id}
                                    className={`transition-colors ${isResolved(q) ? 'bg-gray-50' : 'hover:bg-cyan-50'}`}
                                >
                                    {/* Sender */}
                                    <td className="px-6 py-4 border-r-[4px] border-black">
                                        <div className="font-black text-sm">{q.name}</div>
                                        <div className="text-xs font-bold text-gray-500">{q.email}</div>
                                        {q.createdAt && (
                                            <div className="text-[10px] text-gray-400 font-bold mt-1">
                                                {q.createdAt}
                                            </div>
                                        )}
                                    </td>

                                    {/* Subject */}
                                    <td className="px-6 py-4 border-r-[4px] border-black font-bold text-sm max-w-[160px]">
                                        <span className="line-clamp-2">{q.subject}</span>
                                    </td>

                                    {/* Message */}
                                    <td className="px-6 py-4 border-r-[4px] border-black text-sm max-w-[240px]">
                                        <span className="line-clamp-3 font-bold text-gray-700">{q.message}</span>
                                    </td>

                                    {/* Status Badge */}
                                    <td className="px-6 py-4 border-r-[4px] border-black">
                                        <span className={`px-3 py-1 border-[3px] border-black font-black text-xs uppercase
                                            ${isResolved(q) ? 'bg-lime-400' : 'bg-yellow-300'}`}>
                                            {isResolved(q) ? 'Resolved' : 'Pending'}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {!isResolved(q) && (
                                                <button
                                                    onClick={() => handleResolve(q.id)}
                                                    className="flex items-center gap-1 px-2 py-1 border-2 border-black font-black text-xs uppercase
                                                               bg-white hover:bg-lime-400 transition-colors
                                                               shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                                                               active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
                                                >
                                                    <CheckCircle size={14} strokeWidth={3} />
                                                    Resolve
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(q.id)}
                                                className="flex items-center gap-1 px-2 py-1 border-2 border-black font-black text-xs uppercase
                                                           bg-white hover:bg-red-500 hover:text-white transition-colors
                                                           shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                                                           active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
                                            >
                                                <Trash2 size={14} strokeWidth={3} />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 font-black uppercase text-xl bg-gray-100">
                                        No {filter !== 'all' ? filter : ''} queries found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ContactQueries;