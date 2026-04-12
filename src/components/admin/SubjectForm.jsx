import { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { Trash2 } from 'lucide-react';

const SubjectForm = () => {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await adminApi.getAllSubjects();
      setSubjects(response.data);
    } catch (error) {
      alert('Failed to fetch subjects');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminApi.createSubject(formData);
      setFormData({ name: '', description: '' });
      fetchSubjects();
      alert('Subject created successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create subject');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;

    try {
      await adminApi.deleteSubject(id);
      fetchSubjects();
    } catch (error) {
      alert('Failed to delete subject');
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Subject Management
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({subjects.length} total)
          </span>
        </h2>
      </div>

      {/* FORM CARD */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 space-y-4"
      >
        <h3 className="font-black uppercase text-sm tracking-widest border-b-[4px] border-black pb-3">
          Add New Subject
        </h3>

        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="flex-1 px-4 py-2 border-[3px] border-black font-bold focus:outline-none focus:bg-yellow-50 transition-colors placeholder:text-gray-400"
            placeholder="Subject name e.g. Java Spring-Boot"
            required
          />
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="flex-1 px-4 py-2 border-[3px] border-black font-bold focus:outline-none focus:bg-yellow-50 transition-colors placeholder:text-gray-400"
            placeholder="Brief description..."
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-lime-400 border-[3px] border-black font-black uppercase hover:bg-lime-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? 'Saving...' : '+ Add Subject'}
          </button>
        </div>
      </form>

      {/* TABLE */}
      <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-yellow-300 border-b-[4px] border-black">
              <th className="px-6 py-4 font-black uppercase text-sm border-r-[4px] border-black">
                Subject Name
              </th>
              <th className="px-6 py-4 font-black uppercase text-sm border-r-[4px] border-black">
                Description
              </th>
              <th className="px-6 py-4 font-black uppercase text-sm text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-[4px] divide-black">
            {subjects.length > 0 ? subjects.map((subject) => (
              <tr key={subject.id} className="hover:bg-cyan-50 transition-colors">
                <td className="px-6 py-4 font-bold border-r-[4px] border-black">
                  {subject.name}
                </td>
                <td className="px-6 py-4 border-r-[4px] border-black text-sm text-gray-600 font-bold">
                  {subject.description || (
                    <span className="italic text-gray-400 font-normal">
                      No description provided
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(subject.id)}
                    className="font-black uppercase text-xs border-2 border-black px-2 py-1 hover:bg-red-500 hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <Trash2 size={16} strokeWidth={3} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="3" className="text-center py-12 font-black uppercase text-xl bg-gray-100">
                  No subjects found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubjectForm;