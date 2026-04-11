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
    <div className="p-6 bg-[#eef2ff] min-h-screen font-sans text-black">
      {/* Header Section */}
      <div className="mb-10">
        <h2 className="text-3xl font-black uppercase tracking-tighter italic">
          Manage <span className="text-[#3b82f6]">Subjects</span>
        </h2>
        <div className="h-1.5 w-20 bg-black mt-1"></div>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="mb-12 p-8 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6 max-w-2xl"
      >
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-gray-600">
            Subject Nomenclature
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border-2 border-black bg-[#f8fafc] font-bold focus:outline-none focus:bg-[#dbeafe] transition-colors rounded-none placeholder:text-gray-400"
            placeholder="e.g., Java Spring-Boot"
            required
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-gray-600">
            Curriculum Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 border-2 border-black bg-[#f8fafc] font-bold focus:outline-none focus:bg-[#dbeafe] transition-colors rounded-none resize-none"
            rows="3"
            placeholder="Brief overview of subject scope..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#3b82f6] text-white px-8 py-3 border-2 border-black font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:bg-black transition-all disabled:opacity-50 disabled:translate-x-0 disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          {loading ? 'ARCHIVING...' : 'Add Subject Asset'}
        </button>
      </form>

      {/* List Section */}
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-4 mb-4">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">
            Existing Repository
          </h3>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="flex justify-between items-center p-5 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group hover:bg-[#f0f9ff] transition-colors"
          >
            <div>
              <h4 className="font-black uppercase text-sm tracking-tight">{subject.name}</h4>
              <p className="text-gray-500 text-[11px] font-bold mt-1 max-w-md">
                {subject.description || 'No description provided for this entry.'}
              </p>
            </div>

            <button
              onClick={() => handleDelete(subject.id)}
              className="bg-white hover:bg-red-500 hover:text-white p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
            >
              <Trash2 size={18} strokeWidth={3} />
            </button>
          </div>
        ))}

        {subjects.length === 0 && (
          <div className="p-10 border-2 border-dashed border-gray-400 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Database Empty: No Subjects Defined
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectForm;