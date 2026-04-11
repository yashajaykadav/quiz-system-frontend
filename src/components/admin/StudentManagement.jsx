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

    // ✅ PAGINATION STATE
    const [currentPage, setCurrentPage] = useState(0);   // Spring uses 0-indexed pages
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize, setPageSize] = useState(10);         // rows per page
    const [sortBy, setSortBy] = useState('fullName');     // default sort field
    const [sortDir, setSortDir] = useState('asc');        // asc or desc

    // ✅ SEARCH STATE (optional but common with pagination)
    const [searchTerm, setSearchTerm] = useState('');

    // ✅ FETCH STUDENTS WITH PAGINATION PARAMS
    const fetchStudents = async () => {
        try {
            setLoading(true);

            // Build query parameters that Spring Boot expects
            const params = {
                page: currentPage,
                size: pageSize,
                sort: `${sortBy},${sortDir}`
            };

            // If you have a search endpoint
            if (searchTerm.trim()) {
                params.search = searchTerm.trim();
            }

            const res = await api.get('/admin/students', { params });

            // ✅ Extract data from Spring Boot's Page response
            const pageData = res.data;

            setStudents(Array.isArray(pageData.content) ? pageData.content : []);
            setTotalPages(pageData.totalPages || 0);
            setTotalElements(pageData.totalElements || 0);
            // Sync current page in case backend corrects it
            setCurrentPage(pageData.number || 0);

        } catch (err) {
            console.error("Error fetching students", err);
            setStudents([]);
            setTotalPages(0);
            setTotalElements(0);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Re-fetch when pagination/sort/search changes
    useEffect(() => {
        fetchStudents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, pageSize, sortBy, sortDir]);

    // ✅ Debounced search - reset to page 0 when searching
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setCurrentPage(0); // reset to first page on new search
            fetchStudents();
        }, 400);

        return () => clearTimeout(delayDebounce);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    // ✅ PAGINATION HANDLERS
    const handleFirstPage = () => setCurrentPage(0);
    const handlePrevPage = () => setCurrentPage(prev => Math.max(0, prev - 1));
    const handleNextPage = () => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
    const handleLastPage = () => setCurrentPage(totalPages - 1);
    const handlePageClick = (pageNum) => setCurrentPage(pageNum);

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(0); // reset to first page when changing size
    };

    // ✅ SORT HANDLER
    const handleSort = (field) => {
        if (sortBy === field) {
            // Toggle direction if same field
            setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(field);
            setSortDir('asc');
        }
        setCurrentPage(0); // reset to first page on sort change
    };

    // ✅ Sort indicator icon
    const getSortIcon = (field) => {
        if (sortBy !== field) return '↕';
        return sortDir === 'asc' ? '↑' : '↓';
    };

    // ✅ Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5; // show max 5 page buttons

        let startPage = Math.max(0, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);

        // Adjust start if we're near the end
        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(0, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

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
            alert(
                "Error adding student: " +
                (err.response?.data?.message || "Server Error")
            );
        }
    };

    // ✅ RESET PASSWORD
    const handleResetPassword = async (studentId) => {
        const newPass = prompt("Enter new password for student:");
        if (!newPass) return;

        try {
            await api.patch(
                `/admin/students/${studentId}/reset-password`,
                newPass,
                { headers: { 'Content-Type': 'text/plain' } }
            );
            alert("Password updated successfully!");
        } catch (err) {
            alert("Failed to reset password.");
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

    // ✅ Calculate display range
    const startEntry = totalElements === 0 ? 0 : currentPage * pageSize + 1;
    const endEntry = Math.min((currentPage + 1) * pageSize, totalElements);

    return (
        <div className="space-y-6">

            {/* ═══════════ HEADER ═══════════ */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                    Student Directory
                    <span className="text-sm font-normal text-gray-500 ml-2">
                        ({totalElements} total)
                    </span>
                </h2>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    + Add Student
                </button>
            </div>

            {/* ═══════════ SEARCH & PAGE SIZE ═══════════ */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                {/* Search Input */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 border rounded-lg w-64 
                                   focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <svg
                        className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>

                {/* Page Size Selector */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <label>Show</label>
                    <select
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                        className="border rounded px-2 py-1 focus:outline-none 
                                   focus:ring-2 focus:ring-blue-300"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                    <label>entries</label>
                </div>
            </div>

            {/* ═══════════ TABLE ═══════════ */}
            <div className="bg-white border rounded shadow-sm overflow-x-auto">
                {loading ? (
                    <div className="p-6 text-center text-gray-500">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 
                                        border-b-2 border-blue-500 mr-2" />
                        Loading...
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                {/* Sortable Headers */}
                                <th
                                    className="px-4 py-3 text-left cursor-pointer 
                                               hover:bg-gray-200 select-none"
                                    onClick={() => handleSort('fullName')}
                                >
                                    Full Name {getSortIcon('fullName')}
                                </th>

                                <th
                                    className="px-4 py-3 text-left cursor-pointer 
                                               hover:bg-gray-200 select-none"
                                    onClick={() => handleSort('username')}
                                >
                                    Details {getSortIcon('username')}
                                </th>

                                <th
                                    className="px-4 py-3 text-left cursor-pointer 
                                               hover:bg-gray-200 select-none"
                                    onClick={() => handleSort('active')}
                                >
                                    Status {getSortIcon('active')}
                                </th>

                                <th className="px-4 py-3 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {students.length > 0 ? (
                                students.map((student) => {
                                    const sId = student.id || student._id;
                                    return (
                                        <tr key={sId} className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium">
                                                {student.fullName}
                                            </td>

                                            <td className="px-4 py-3">
                                                <div>{student.username}</div>
                                                <div className="text-xs text-gray-500">
                                                    {student.email}
                                                </div>
                                            </td>

                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => handleToggleStatus(sId)}
                                                    className={`px-2 py-1 text-xs rounded ${student.active
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                        }`}
                                                >
                                                    {student.active ? 'Active' : 'Blocked'}
                                                </button>
                                            </td>

                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={() => handleResetPassword(sId)}
                                                    className="text-blue-500 hover:underline text-sm"
                                                >
                                                    Reset Password
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="text-center py-6 text-gray-500"
                                    >
                                        No students found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ═══════════ PAGINATION CONTROLS ═══════════ */}
            {!loading && totalPages > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center 
                                gap-3 text-sm text-gray-600">

                    {/* Entry Info */}
                    <div>
                        Showing {startEntry} to {endEntry} of {totalElements} entries
                    </div>

                    {/* Page Buttons */}
                    <div className="flex items-center gap-1">
                        {/* First */}
                        <button
                            onClick={handleFirstPage}
                            disabled={currentPage === 0}
                            className="px-2 py-1 border rounded hover:bg-gray-100 
                                       disabled:opacity-40 disabled:cursor-not-allowed"
                            title="First Page"
                        >
                            «
                        </button>

                        {/* Previous */}
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 0}
                            className="px-2 py-1 border rounded hover:bg-gray-100 
                                       disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Previous Page"
                        >
                            ‹
                        </button>

                        {/* Page Numbers */}
                        {getPageNumbers().map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => handlePageClick(pageNum)}
                                className={`px-3 py-1 border rounded ${currentPage === pageNum
                                        ? 'bg-blue-500 text-white border-blue-500'
                                        : 'hover:bg-gray-100'
                                    }`}
                            >
                                {pageNum + 1}  {/* Display 1-indexed to user */}
                            </button>
                        ))}

                        {/* Next */}
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage >= totalPages - 1}
                            className="px-2 py-1 border rounded hover:bg-gray-100 
                                       disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Next Page"
                        >
                            ›
                        </button>

                        {/* Last */}
                        <button
                            onClick={handleLastPage}
                            disabled={currentPage >= totalPages - 1}
                            className="px-2 py-1 border rounded hover:bg-gray-100 
                                       disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Last Page"
                        >
                            »
                        </button>
                    </div>
                </div>
            )}

            {/* ═══════════ ADD STUDENT MODAL ═══════════ */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <form
                        onSubmit={handleAddStudent}
                        className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-3"
                    >
                        <h3 className="text-lg font-semibold">Add Student</h3>

                        <input
                            type="text"
                            placeholder="Full Name"
                            required
                            className="w-full p-2 border rounded"
                            value={newStudent.fullName}
                            onChange={(e) =>
                                setNewStudent({ ...newStudent, fullName: e.target.value })
                            }
                        />

                        <input
                            type="text"
                            placeholder="Username"
                            required
                            className="w-full p-2 border rounded"
                            value={newStudent.username}
                            onChange={(e) =>
                                setNewStudent({ ...newStudent, username: e.target.value })
                            }
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            required
                            className="w-full p-2 border rounded"
                            value={newStudent.email}
                            onChange={(e) =>
                                setNewStudent({ ...newStudent, email: e.target.value })
                            }
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            required
                            className="w-full p-2 border rounded"
                            value={newStudent.password}
                            onChange={(e) =>
                                setNewStudent({ ...newStudent, password: e.target.value })
                            }
                        />

                        <div className="flex gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 py-2 border rounded"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="flex-1 py-2 bg-blue-500 text-white rounded 
                                           hover:bg-blue-600"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default StudentManagement;