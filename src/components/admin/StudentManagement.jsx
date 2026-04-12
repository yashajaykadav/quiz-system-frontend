import { useState, useEffect } from 'react';
import api from '../../api/axios';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newStudent, setNewStudent] = useState({
        fullName: '',
        username: '',
        email: '',
        password: ''
    });
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchStudents = async (page = currentPage) => {
        try {
            setLoading(true);
            const params = { page, size: pageSize, sort: 'fullName,asc' };
            if (searchTerm.trim()) params.search = searchTerm.trim();

            const res = await api.get('/admin/students', { params });
            const pageData = res.data;

            setStudents(pageData.content ?? []);
            setTotalPages(pageData.totalPages ?? 0);
            setTotalElements(pageData.totalElements ?? 0);
            setCurrentPage(pageData.number ?? 0);
        } catch (err) {
            console.error("Error fetching students", err);
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [currentPage, pageSize]);

    useEffect(() => {
        const delay = setTimeout(() => {
            setCurrentPage(0);
            fetchStudents(0);
        }, 400);
        return () => clearTimeout(delay);
    }, [searchTerm]);

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/students', newStudent);
            setShowAddModal(false);
            setNewStudent({ fullName: '', username: '', email: '', password: '' });
            fetchStudents();
            alert("Student registered successfully!");
        } catch (err) {
            alert("Error adding student: " + (err.response?.data?.message || "Server Error"));
        }
    };

    const handleResetPassword = async (studentId) => {
        const newPass = prompt("Enter new password for student:");
        if (!newPass) return;
        try {
            await api.patch(`/admin/students/${studentId}/reset-password`, newPass, {
                headers: { 'Content-Type': 'text/plain' }
            });
            alert("Password updated successfully!");
        } catch {
            alert("Failed to reset password.");
        }
    };

    const handleToggleStatus = async (studentId) => {
        try {
            await api.patch(`/admin/students/${studentId}/toggle-status`);
            fetchStudents();
        } catch {
            alert("Failed to update status");
        }
    };

    const startEntry = totalElements === 0 ? 0 : currentPage * pageSize + 1;
    const endEntry = Math.min((currentPage + 1) * pageSize, totalElements);

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                    Student Directory
                    <span className="text-sm font-normal text-gray-500 ml-2">({totalElements} total)</span>
                </h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    + Add Student
                </button>
            </div>

            {/* SEARCH & PAGE SIZE */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <label>Show</label>
                    <select
                        value={pageSize}
                        onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(0); }}
                        className="border rounded px-2 py-1"
                    >
                        {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <label>entries</label>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block animate-spin h-10 w-10 border-[4px] border-black border-b-yellow-400 mr-4" />
                        <span className="font-black text-2xl uppercase">Fetching Data...</span>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-yellow-300 border-b-[4px] border-black">
                                <th className="px-6 py-4 font-black uppercase text-sm border-r-[4px] border-black">Full Name</th>
                                <th className="px-6 py-4 font-black uppercase text-sm border-r-[4px] border-black">Details</th>
                                <th className="px-6 py-4 font-black uppercase text-sm border-r-[4px] border-black">Status</th>
                                <th className="px-6 py-4 font-black uppercase text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-[4px] divide-black">
                            {students.length > 0 ? students.map((student) => (
                                <tr key={student.id} className="hover:bg-cyan-50 transition-colors">
                                    <td className="px-6 py-4 font-bold border-r-[4px] border-black text-lg">{student.fullName}</td>
                                    <td className="px-6 py-4 border-r-[4px] border-black">
                                        <div className="font-black text-sm uppercase">{student.username}</div>
                                        <div className="text-xs font-bold text-gray-600">{student.email}</div>
                                    </td>
                                    <td className="px-6 py-4 border-r-[4px] border-black">
                                        <button
                                            onClick={() => handleToggleStatus(student.id)}
                                            className={`px-4 py-1 font-black uppercase border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all
                                                ${student.active ? 'bg-lime-400' : 'bg-red-500 text-white'}`}
                                        >
                                            {student.active ? 'Active' : 'Blocked'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleResetPassword(student.id)}
                                            className="font-black uppercase text-xs border-2 border-black px-2 py-1 hover:bg-black hover:text-white transition-all"
                                        >
                                            Reset Password
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-12 font-black uppercase text-xl bg-gray-100">
                                        No students found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* PAGINATION */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-between items-center p-4 bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <span className="font-bold text-sm">
                        Showing {startEntry}–{endEntry} of {totalElements}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                            disabled={currentPage === 0}
                            className="px-3 py-1 border-[3px] border-black font-black bg-white hover:bg-cyan-400 disabled:opacity-30"
                        >
                            ‹
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i)
                            .slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 3))
                            .map(pageNum => (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-3 py-1 border-[3px] border-black font-black transition-all
                                        ${currentPage === pageNum ? 'bg-lime-400' : 'bg-white hover:bg-yellow-300'}`}
                                >
                                    {pageNum + 1}
                                </button>
                            ))}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={currentPage >= totalPages - 1}
                            className="px-3 py-1 border-[3px] border-black font-black bg-white hover:bg-cyan-400 disabled:opacity-30"
                        >
                            ›
                        </button>
                    </div>
                </div>
            )}

            {/* ADD STUDENT MODAL */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                    <form
                        onSubmit={handleAddStudent}
                        className="bg-white border-[4px] border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md space-y-4"
                    >
                        <h3 className="text-2xl font-black uppercase border-b-[4px] border-black pb-2">
                            Add New Student
                        </h3>

                        {[
                            { placeholder: "Full Name", type: "text", field: 'fullName' },
                            { placeholder: "Username", type: "text", field: 'username' },
                            { placeholder: "Email", type: "email", field: 'email' },
                            { placeholder: "Password", type: "password", field: 'password' },
                        ].map(({ placeholder, type, field }) => (
                            <input
                                key={field}
                                type={type}
                                placeholder={placeholder}
                                required
                                value={newStudent[field]}
                                onChange={(e) => setNewStudent({ ...newStudent, [field]: e.target.value })}
                                className="w-full p-3 border-[3px] border-black font-bold focus:bg-yellow-200 outline-none"
                            />
                        ))}

                        <div className="flex gap-4 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 py-3 border-[3px] border-black font-black uppercase hover:bg-red-500 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-3 bg-lime-400 border-[3px] border-black font-black uppercase hover:bg-lime-500 transition-colors"
                            >
                                Save Student
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default StudentManagement;