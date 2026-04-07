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
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Subjects</h2>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Subject Name</label>
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
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Adding...' : 'Add Subject'}
        </button>
      </form>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Existing Subjects</h3>
        {subjects.map((subject) => (
          <div key={subject.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-semibold">{subject.name}</h4>
              <p className="text-gray-600 text-sm">{subject.description}</p>
            </div>
            <button
              onClick={() => handleDelete(subject.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectForm;