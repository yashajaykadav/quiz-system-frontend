import { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { Trash2 } from 'lucide-react';

const TopicForm = () => {
  const [formData, setFormData] = useState({ name: '', description: '', subjectId: '' });
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
    fetchTopics();
  }, []);

  const fetchSubjects = async () => {
    const response = await adminApi.getAllSubjects();
    setSubjects(response.data);
  };

  const fetchTopics = async () => {
    const response = await adminApi.getAllTopics();
    setTopics(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminApi.createTopic(formData);
      setFormData({ name: '', description: '', subjectId: '' });
      fetchTopics();
      alert('Topic created successfully');
    } catch (error) {
      alert('Failed to create topic');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await adminApi.deleteTopic(id);
      fetchTopics();
    } catch (error) {
      alert('Failed to delete topic');
    }
  };

  return (
    <div className="p-6 bg-[#eef2ff] min-h-screen font-sans text-black">
      {/* Header Section */}
      <div className="mb-10">
        <h2 className="text-3xl font-black uppercase tracking-tighter italic">
          Manage <span className="text-[#3b82f6]">Topics</span>
        </h2>
        <div className="h-1.5 w-20 bg-black mt-1"></div>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="mb-12 p-8 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6 max-w-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-gray-600">
              Parent Subject
            </label>
            <select
              value={formData.subjectId}
              onChange={(e) =>
                setFormData({ ...formData, subjectId: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-black bg-[#f8fafc] font-bold focus:outline-none focus:bg-[#dbeafe] transition-colors rounded-none appearance-none cursor-pointer"
              required
            >
              <option value="">Select Asset</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-gray-600">
              Topic Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-black bg-[#f8fafc] font-bold focus:outline-none focus:bg-[#dbeafe] transition-colors rounded-none placeholder:text-gray-400"
              placeholder="e.g., QUANTUM BASICS"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-gray-600">
            Detailed Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-black bg-[#f8fafc] font-bold focus:outline-none focus:bg-[#dbeafe] transition-colors rounded-none resize-none"
            rows="3"
            placeholder="Define topic scope..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#3b82f6] text-white px-8 py-3 border-2 border-black font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
        >
          {loading ? 'SYNCING...' : 'Deploy Topic'}
        </button>
      </form>

      {/* LIST SECTION */}
      <div className="max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">
            Existing Topics
          </h3>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <div className="space-y-4">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="flex justify-between items-center p-5 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group hover:bg-[#f0f9ff] transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-black text-white text-[9px] px-1.5 py-0.5 font-bold uppercase italic">
                    {topic.subjectName}
                  </span>
                  <h4 className="font-black uppercase text-sm tracking-tight">{topic.name}</h4>
                </div>
                <p className="text-gray-500 text-[11px] font-bold max-w-md">
                  {topic.description || 'No supplementary data provided.'}
                </p>
              </div>

              <button
                onClick={() => handleDelete(topic.id)}
                className="bg-white hover:bg-red-500 hover:text-white p-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
              >
                <Trash2 size={18} strokeWidth={3} />
              </button>
            </div>
          ))}

          {topics.length === 0 && (
            <div className="p-10 border-2 border-dashed border-gray-400 text-center bg-white/50">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Zero Topics Found in Repository
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicForm;