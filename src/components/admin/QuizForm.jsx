import { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { Trash2 } from 'lucide-react';

const QuizForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectId: '',
    topicId: '',
    questionIds: [],
    durationMinutes: 60,
    scheduledDate: '',
  });

  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (formData.subjectId) {
      fetchTopics(formData.subjectId);
    } else {
      setTopics([]);
    }
  }, [formData.subjectId]);

  useEffect(() => {
    if (formData.subjectId && formData.topicId) {
      fetchQuestions(formData.subjectId, formData.topicId);
    } else {
      setQuestions([]);
    }
  }, [formData.subjectId, formData.topicId]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this quiz permanently?')) return;
    try {
      await adminApi.deleteQuiz(id);
      setQuizzes(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      alert('Failed to delete quiz: ' + (err.response?.data?.message || 'Server error'));
    }
  };
  const fetchSubjects = async () => {
    try {
      const res = await adminApi.getAllSubjects();
      setSubjects(res.data || []);
    } catch {
      alert('Failed to load subjects');
    }
  };

  const fetchTopics = async (subjectId) => {
    try {
      const res = await adminApi.getTopicsBySubject(subjectId);
      setTopics(res.data || []);
    } catch {
      alert('Failed to load topics');
    }
  };

  const fetchQuestions = async (subjectId, topicId) => {
    try {
      const res = await adminApi.getQuestionsByFilter(subjectId, topicId);
      setQuestions(res.data || []);
    } catch {
      alert('Failed to load questions');
    }
  };

  const fetchQuizzes = async () => {
    try {
      const res = await adminApi.getAllQuizzes();
      setQuizzes(res.data || []);
    } catch {
      alert('Failed to load quizzes');
    }
  };

  const handleQuestionToggle = (id) => {
    setFormData((prev) => ({
      ...prev,
      questionIds: prev.questionIds.includes(id)
        ? prev.questionIds.filter((q) => q !== id)
        : [...prev.questionIds, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.questionIds.length) {
      alert('Select at least one question');
      return;
    }

    try {
      setLoading(true);
      await adminApi.createQuiz(formData);
      alert('Quiz created successfully');

      fetchQuizzes();
      resetForm();
    } catch {
      alert('Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subjectId: '',
      topicId: '',
      questionIds: [],
      durationMinutes: 60,
      scheduledDate: '',
    });
    setQuestions([]);
  };
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Quiz Management
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({quizzes.length} total)
          </span>
        </h2>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 space-y-5"
      >
        <h3 className="font-black uppercase text-sm tracking-widest border-b-[4px] border-black pb-3">
          Create New Quiz
        </h3>

        {/* Title & Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Quiz title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="px-4 py-2 border-[3px] border-black font-bold focus:outline-none focus:bg-yellow-50 transition-colors"
            required
          />
          <input
            type="text"
            placeholder="Short description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="px-4 py-2 border-[3px] border-black font-bold focus:outline-none focus:bg-yellow-50 transition-colors"
          />
        </div>

        {/* Subject + Topic + Duration + Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            value={formData.subjectId}
            onChange={(e) => setFormData({ ...formData, subjectId: e.target.value, topicId: '', questionIds: [] })}
            className="px-4 py-2 border-[3px] border-black font-bold focus:outline-none focus:bg-yellow-50 transition-colors"
            required
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select
            value={formData.topicId}
            onChange={(e) => setFormData({ ...formData, topicId: e.target.value, questionIds: [] })}
            className="px-4 py-2 border-[3px] border-black font-bold focus:outline-none focus:bg-yellow-50 transition-colors disabled:opacity-40"
            disabled={!formData.subjectId}
            required
          >
            <option value="">Select Topic</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Duration (min)"
            value={formData.durationMinutes}
            onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 0 })}
            className="px-4 py-2 border-[3px] border-black font-bold focus:outline-none focus:bg-yellow-50 transition-colors"
            required
            min="1"
          />

          <input
            type="datetime-local"
            value={formData.scheduledDate}
            onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
            className="px-4 py-2 border-[3px] border-black font-bold focus:outline-none focus:bg-yellow-50 transition-colors"
            required
          />
        </div>

        {/* Question Selection */}
        {questions.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-black uppercase text-sm tracking-widest">Question Selection</span>
              <span className="text-xs font-black bg-lime-400 px-2 py-1">
                {formData.questionIds.length} Selected
              </span>
            </div>
            <div className="max-h-60 overflow-y-auto border-[3px] border-black divide-y-[2px] divide-black bg-white">
              {questions.map((q) => {
                const selected = formData.questionIds.includes(q.id);
                return (
                  <div
                    key={q.id}
                    onClick={() => handleQuestionToggle(q.id)}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors
                                        ${selected ? 'bg-lime-400' : 'hover:bg-cyan-50'}`}
                  >
                    <div className={`mt-1 w-5 h-5 border-2 border-black flex-shrink-0 flex items-center justify-center
                                        ${selected ? 'bg-black' : 'bg-white'}`}>
                      {selected && <div className="w-2 h-2 bg-white" />}
                    </div>
                    <div className="flex-1 text-sm font-bold">
                      <div className="line-clamp-2">{q.questionText}</div>
                      {q.codeSnippet && (
                        <span className="text-[10px] font-black bg-black text-green-400 px-1">
                          CODE
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-lime-400 border-[3px] border-black font-black uppercase hover:bg-lime-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all disabled:opacity-50 w-full"
        >
          {loading ? 'Saving...' : '+ Create Quiz'}
        </button>
      </form>

      {/* TABLE */}
      <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-yellow-300 border-b-[4px] border-black">
              <th className="px-6 py-4 font-black uppercase text-sm border-r-[4px] border-black">
                Quiz Title
              </th>
              <th className="px-6 py-4 font-black uppercase text-sm border-r-[4px] border-black">
                Subject / Topic
              </th>
              <th className="px-6 py-4 font-black uppercase text-sm border-r-[4px] border-black">
                Questions
              </th>
              <th className="px-6 py-4 font-black uppercase text-sm border-r-[4px] border-black">
                Duration
              </th>
              <th className="px-6 py-4 font-black uppercase text-sm border-r-[4px] border-black">
                Scheduled
              </th>
              <th className="px-6 py-4 font-black uppercase text-sm text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-[4px] divide-black">
            {quizzes.length > 0 ? quizzes.map((quiz) => (
              <tr key={quiz.id} className="hover:bg-cyan-50 transition-colors">
                <td className="px-6 py-4 font-bold border-r-[4px] border-black max-w-xs">
                  <span className="line-clamp-1">{quiz.title}</span>
                </td>
                <td className="px-6 py-4 border-r-[4px] border-black">
                  <div className="font-black text-sm uppercase">{quiz.subjectName}</div>
                  <div className="text-xs font-bold text-gray-500">{quiz.topicName}</div>
                </td>
                <td className="px-6 py-4 border-r-[4px] border-black font-bold text-center">
                  {quiz.totalQuestions}
                </td>
                <td className="px-6 py-4 border-r-[4px] border-black font-bold text-center">
                  {quiz.durationMinutes} min
                </td>
                <td className="px-6 py-4 border-r-[4px] border-black text-sm font-bold">
                  {quiz.scheduledDate ? quiz.scheduledDate.replace('T', ' ') : '—'}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(quiz.id)}
                    className="font-black uppercase text-xs border-2 border-black px-2 py-1 hover:bg-red-500 hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <Trash2 size={16} strokeWidth={3} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="text-center py-12 font-black uppercase text-xl bg-gray-100">
                  No quizzes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default QuizForm;