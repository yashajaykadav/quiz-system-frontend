import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8081';

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

    // ✅ Get token once
    const getAuthHeader = () => {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`
        };
    };

    // ✅ FETCH STUDENTS
    const fetchStudents = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/admin/students`, {
                headers: getAuthHeader()
            });

            console.log("API RESPONSE:", res.data);

            setStudents(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching students", err);
            setStudents([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // ✅ ADD STUDENT
    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                'http://localhost:8081/api/admin/students',
                newStudent,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            setShowAddModal(false);
            fetchStudents();
            setNewStudent({ fullName: '', username: '', email: '', password: '' });

        } catch (err) {
            console.error(err);
            alert("Error adding student");
        }
    };

    // ✅ RESET PASSWORD
    const handleResetPassword = async (id) => {
        const newPass = prompt("Enter new password for student:");
        if (!newPass) return;

        try {
            await axios.patch(
                `${API_BASE}/api/admin/students/${id}/reset-password`,
                newPass,
                {
                    headers: {
                        'Content-Type': 'text/plain',
                        ...getAuthHeader()
                    }
                }
            );

            alert("Password updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to reset password");
        }
    };

    // ✅ TOGGLE STATUS
    const handleToggleStatus = async (id) => {
        try {
            await axios.patch(
                `${API_BASE}/api/admin/students/${id}/toggle-status`,
                {},
                {
                    headers: getAuthHeader()
                }
            );

            fetchStudents();
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        }
    };

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Student Directory</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-md"
                >
                    + Add New Student
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-6 text-center">Loading students...</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase">Full Name</th>
                                <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase">Username / Email</th>
                                <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {Array.isArray(students) && students.length > 0 ? (
                                students.map(student => (
                                    <tr key={student.id} className="hover:bg-slate-50/50 transition">
                                        <td className="px-6 py-4 font-semibold text-slate-900">
                                            {student.fullName}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-900">{student.username}</div>
                                            <div className="text-xs text-slate-400">{student.email}</div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleStatus(student.id)}
                                                className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${student.active
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                    }`}
                                            >
                                                {student.active ? 'Active' : 'Blocked'}
                                            </button>
                                        </td>

                                        <td className="px-6 py-4 text-right space-x-4">
                                            <button
                                                onClick={() => handleResetPassword(student.id)}
                                                className="text-blue-600 font-bold text-sm hover:text-blue-800"
                                            >
                                                Reset Password
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-6 text-slate-400">
                                        No students found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* MODAL */}
            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <form
                        onSubmit={handleAddStudent}
                        className="bg-white p-8 rounded-[2rem] shadow-xl w-full max-w-md space-y-4"
                    >
                        <h3 className="text-xl font-black">Register New Student</h3>

                        <input
                            type="text"
                            placeholder="Full Name"
                            required
                            className="w-full p-3 border rounded-xl"
                            onChange={e => setNewStudent({ ...newStudent, fullName: e.target.value })}
                        />

                        <input
                            type="text"
                            placeholder="Username"
                            required
                            className="w-full p-3 border rounded-xl"
                            onChange={e => setNewStudent({ ...newStudent, username: e.target.value })}
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            required
                            className="w-full p-3 border rounded-xl"
                            onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
                        />

                        <input
                            type="password"
                            placeholder="Initial Password"
                            required
                            className="w-full p-3 border rounded-xl"
                            onChange={e => setNewStudent({ ...newStudent, password: e.target.value })}
                        />

                        <div className="flex gap-2 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 py-3 font-bold text-slate-500"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold"
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