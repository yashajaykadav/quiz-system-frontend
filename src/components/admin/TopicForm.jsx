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
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Topic Management
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({topics.length} total)
          </span>
        </h2>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 space-y-4"
      >
        <h3 className="font-black uppercase text-sm tracking-widest border-b-[4px] border-black pb-3">
          Add New Topic
        </h3>

        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={formData.subjectId}
            onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
            className="flex-1 px-4 py-2 border-[3px] border-black font-bold focus:outline-none focus:bg-yellow-50 transition-colors"
            required
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="flex-1 px-4 py-2 border-[3px] border-black font-bold focus:outline-none focus:bg-yellow-50 transition-colors placeholder:text-gray-400"
            placeholder="Topic name e.g. Quantum Basics"
            required
          />

          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="flex-1 px-4 py-2 border-[3px] border-black font-bold focus:outline-none focus:bg-yellow-50 transition-colors placeholder:text-gray-400"
            placeholder="Short description..."
          />

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-lime-400 border-[3px] border-black font-black uppercase hover:bg-lime-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? 'Saving...' : '+ Add Topic'}
          </button>
        </div>
      </form>

      {/* TABLE */}
      <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-yellow-300 border-b-[4px] border-black">
              <th className="px-6 py-4 font-black uppercase text-sm border-r-[4px] border-black">
                Subject
              </th>
              <th className="px-6 py-4 font-black uppercase text-sm border-r-[4px] border-black">
                Topic Name
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
            {topics.length > 0 ? topics.map((topic) => (
              <tr key={topic.id} className="hover:bg-cyan-50 transition-colors">
                <td className="px-6 py-4 border-r-[4px] border-black">
                  <span className="px-2 py-1 bg-black text-white text-xs font-black uppercase">
                    {topic.subjectName}
                  </span>
                </td>
                <td className="px-6 py-4 border-r-[4px] border-black font-black text-sm uppercase">
                  {topic.name}
                </td>
                <td className="px-6 py-4 border-r-[4px] border-black text-sm font-bold text-gray-600">
                  {topic.description || (
                    <span className="italic text-gray-400 font-normal">
                      No description
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(topic.id)}
                    className="font-black uppercase text-xs border-2 border-black px-2 py-1 hover:bg-red-500 hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <Trash2 size={16} strokeWidth={3} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="text-center py-12 font-black uppercase text-xl bg-gray-100">
                  No topics found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopicForm;