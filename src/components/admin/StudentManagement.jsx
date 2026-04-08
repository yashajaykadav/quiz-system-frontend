import { useState, useEffect } from 'react';
// Correct relative path based on: src/components/admin/ -> src/api/axios
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

    // ✅ FETCH STUDENTS
    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/students');
            // Support both SQL 'id' and MongoDB '_id'
            setStudents(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Error fetching students", err);
            setStudents([]);
        } finally {
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
            await api.post('/admin/students', newStudent);
            setShowAddModal(false);
            fetchStudents();
            setNewStudent({ fullName: '', username: '', email: '', password: '' });
            alert("Student registered successfully!");
        } catch (err) {
            alert("Error adding student: " + (err.response?.data?.message || "Server Error"));
        }
    };

    // ✅ RESET PASSWORD
    const handleResetPassword = async (studentId) => {
        const newPass = prompt("Enter new password for student:");
        if (!newPass) return;

        try {
            // Note: If your Spring Boot backend expects a JSON object, 
            // use: { password: newPass } instead of just newPass.
            await api.patch(`/admin/students/${studentId}/reset-password`, newPass, {
                headers: { 'Content-Type': 'text/plain' }
            });
            alert("Password updated successfully!");
        } catch (err) {
            alert("Failed to reset password. Check if backend expects JSON instead of plain text.");
        }
    };

    // ✅ TOGGLE STATUS
    const handleToggleStatus = async (studentId) => {
        try {
            await api.patch(`/admin/students/${studentId}/toggle-status`);
            fetchStudents();
        } catch (err) {
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
                    <div className="p-10 text-center text-slate-500 animate-pulse">Loading directory...</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase">Full Name</th>
                                <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase">Account Details</th>
                                <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {students.length > 0 ? (
                                students.map(student => {
                                    const sId = student.id || student._id;
                                    return (
                                        <tr key={sId} className="hover:bg-slate-50/50 transition">
                                            <td className="px-6 py-4 font-semibold text-slate-900">{student.fullName}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-slate-900">{student.username}</div>
                                                <div className="text-xs text-slate-400">{student.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleToggleStatus(sId)}
                                                    className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase transition-colors ${
                                                        student.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}
                                                >
                                                    {student.active ? 'Active' : 'Blocked'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleResetPassword(sId)}
                                                    className="text-blue-600 font-bold text-sm hover:text-blue-800"
                                                >
                                                    Reset Password
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-10 text-slate-400">No students found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ADD STUDENT MODAL */}
            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <form
                        onSubmit={handleAddStudent}
                        className="bg-white p-8 rounded-[2rem] shadow-xl w-full max-w-md space-y-4"
                    >
                        <h3 className="text-xl font-black mb-2">Register New Student</h3>
                        <input
                            type="text"
                            placeholder="Full Name"
                            required
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            value={newStudent.fullName}
                            onChange={e => setNewStudent({ ...newStudent, fullName: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Username"
                            required
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            value={newStudent.username}
                            onChange={e => setNewStudent({ ...newStudent, username: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            value={newStudent.email}
                            onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Initial Password"
                            required
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            value={newStudent.password}
                            onChange={e => setNewStudent({ ...newStudent, password: e.target.value })}
                        />
                        <div className="flex gap-2 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200"
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