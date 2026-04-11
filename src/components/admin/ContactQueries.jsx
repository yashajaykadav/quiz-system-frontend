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
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Student Queries</h2>

            {loading ? (
                <p>Loading...</p>
            ) : queries.length === 0 ? (
                <p className="text-gray-500">No queries found</p>
            ) : (
                queries.map((q) => (
                    <div key={q.id} className="border p-4 rounded-lg bg-gray-50">

                        <div className="flex justify-between mb-2">
                            <div>
                                <p className="font-semibold">{q.name}</p>
                                <p className="text-xs text-gray-500">{q.email}</p>
                            </div>
                            <span className="text-xs text-gray-400">
                                {q.createdAt}
                            </span>
                        </div>

                        <p className="text-sm font-medium text-blue-600 mb-1">
                            {q.subject}
                        </p>

                        <p className="text-sm text-gray-700">
                            {q.message}
                        </p>

                        <div className="mt-3 flex justify-end">
                            <button
                                onClick={() => handleResolve(q.id)}
                                className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                            >
                                Mark Resolved
                            </button>
                        </div>

                    </div>
                ))
            )}
        </div>
    );
};

export default ContactQueries;