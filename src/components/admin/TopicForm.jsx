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
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Topics</h2>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Subject</label>
          <select
            value={formData.subjectId}
            onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Topic Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? 'Adding...' : 'Add Topic'}
        </button>
      </form>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Existing Topics</h3>
        {topics.map((topic) => (
          <div key={topic.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-semibold">{topic.name}</h4>
              <p className="text-sm text-gray-600">Subject: {topic.subjectName}</p>
              <p className="text-gray-600 text-sm">{topic.description}</p>
            </div>
            <button onClick={() => handleDelete(topic.id)} className="text-red-600 hover:text-red-800">
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicForm;