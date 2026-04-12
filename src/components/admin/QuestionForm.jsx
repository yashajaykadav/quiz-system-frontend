import { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { Trash2 } from 'lucide-react';

const QuestionForm = () => {
  const [formData, setFormData] = useState({
    questionText: '',
    codeSnippet: '',
    type: 'OBJECTIVE',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctOption: 1,
    subjectId: '',
    topicId: '',
  });

  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    message: '',
    type: '', // 'success' | 'error'
    visible: false,
  });

  useEffect(() => {
    fetchSubjects();
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (formData.subjectId) {
      fetchTopics(formData.subjectId);
    } else {
      setTopics([]);
    }
  }, [formData.subjectId]);

  const fetchSubjects = async () => {
    try {
      const res = await adminApi.getAllSubjects();
      setSubjects(res.data || []);
    } catch (err) {
      showToast('Failed to load subjects', 'error');
    }
  };

  const fetchTopics = async (subjectId) => {
    console.log("Fetching topics for Subject ID:", subjectId); // DEBUG 1
    try {
      const res = await adminApi.getTopicsBySubject(subjectId);
      console.log("Topics Response:", res.data); // DEBUG 2
      setTopics(res.data || []);
    } catch (err) {
      console.error("Topic Fetch Error:", err.response || err); // DEBUG 3
      console.error("Topic Fetch Error Status:", err.response?.status);
      console.error("Backend Error Message:", err.response?.data);
      showToast('Failed to load topics', 'error');
      showToast('Failed to load topics', 'error');
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await adminApi.getAllQuestions();
      setQuestions(res.data || []);
    } catch (err) {
      showToast('Failed to load questions', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast({ message: '', type: '', visible: false });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminApi.createQuestion(formData);
      showToast('Question created successfully', 'success');
      resetForm();
      fetchQuestions();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create question', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    // We keep subjectId and topicId so the admin can add multiple questions 
    // to the same topic quickly. We only clear the question-specific fields.
    setFormData((prev) => ({
      ...prev,
      questionText: '',
      codeSnippet: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correctOption: 1,
    }));
  };
  return (
    <div className="space-y-6">

      {/* TOAST */}
      {toast.visible && (
        <div className={`fixed top-6 right-6 px-5 py-3 border-[3px] border-black font-black uppercase text-xs z-[100] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                ${toast.type === 'success' ? 'bg-lime-400 text-black' : 'bg-red-500 text-white'}`}>
          {toast.message}
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Question Management
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({questions.length} total)
          </span>
        </h2>
      </div>

      {/* FORM CARD */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 space-y-5"
      >
        <h3 className="font-black uppercase text-sm tracking-widest border-b-[4px] border-black pb-3">
          Add New Question
        </h3>

        {/* SUBJECT + TOPIC */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={formData.subjectId}
            onChange={(e) => setFormData({ ...formData, subjectId: e.target.value, topicId: '' })}
            className="flex-1 px-4 py-2 border-[3px] border-black font-bold focus:outline-none focus:bg-yellow-50 transition-colors"
            required
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select
            value={formData.topicId}
            onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
            className="flex-1 px-4 py-2 border-[3px] border-black font-bold focus:outline-none focus:bg-yellow-50 transition-colors disabled:opacity-40"
            disabled={!formData.subjectId}
            required
          >
            <option value="">Select Topic</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* QUESTION TEXT */}
        <textarea
          placeholder="Enter question text..."
          value={formData.questionText}
          onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
          className="w-full px-4 py-3 border-[3px] border-black font-bold focus:outline-none focus:bg-yellow-50 transition-colors resize-none"
          rows="3"
          required
        />

        {/* CODE SNIPPET */}
        <textarea
          placeholder="// Optional code snippet..."
          value={formData.codeSnippet}
          onChange={(e) => setFormData({ ...formData, codeSnippet: e.target.value })}
          className="w-full px-4 py-3 border-[3px] border-black font-mono text-sm bg-black text-green-400 focus:outline-none resize-none"
          rows="3"
        />

        {/* OPTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((num) => {
            const selected = formData.correctOption === num;
            return (
              <div
                key={num}
                onClick={() => setFormData({ ...formData, correctOption: num })}
                className={`flex items-center gap-3 px-4 py-2 border-[3px] border-black cursor-pointer transition-all
                                ${selected ? 'bg-lime-400 shadow-none' : 'bg-white hover:bg-cyan-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'}`}
              >
                <span className={`w-6 h-6 flex items-center justify-center border-2 border-black font-black text-xs flex-shrink-0
                                ${selected ? 'bg-black text-white' : 'bg-white'}`}>
                  {num}
                </span>
                <input
                  type="text"
                  placeholder={`Option ${num}`}
                  value={formData[`option${num}`]}
                  onChange={(e) => setFormData({ ...formData, [`option${num}`]: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full bg-transparent font-bold text-sm focus:outline-none placeholder:text-gray-400"
                  required
                />
              </div>
            );
          })}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-lime-400 border-[3px] border-black font-black uppercase hover:bg-lime-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all disabled:opacity-50"
        >
          {loading ? 'Saving...' : '+ Add Question'}
        </button>
      </form>

      {/* QUESTIONS TABLE */}
      <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-yellow-300 border-b-[4px] border-black">
              <th className="px-6 py-4 font-black uppercase text-sm border-r-[4px] border-black">
                Question
              </th>
              <th className="px-6 py-4 font-black uppercase text-sm border-r-[4px] border-black">
                Subject / Topic
              </th>
              <th className="px-6 py-4 font-black uppercase text-sm border-r-[4px] border-black">
                Code
              </th>
              <th className="px-6 py-4 font-black uppercase text-sm text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-[4px] divide-black">
            {questions.length > 0 ? questions.map((q) => (
              <tr key={q.id} className="hover:bg-cyan-50 transition-colors">
                <td className="px-6 py-4 font-bold border-r-[4px] border-black max-w-xs">
                  <span className="line-clamp-2 text-sm">{q.questionText}</span>
                </td>
                <td className="px-6 py-4 border-r-[4px] border-black">
                  <div className="font-black text-sm uppercase">{q.subjectName}</div>
                  <div className="text-xs font-bold text-gray-500">{q.topicName}</div>
                </td>
                <td className="px-6 py-4 border-r-[4px] border-black">
                  {q.codeSnippet ? (
                    <span className="px-2 py-1 bg-black text-green-400 text-[10px] font-black uppercase">
                      Yes
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs font-bold">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="font-black uppercase text-xs border-2 border-black px-2 py-1 hover:bg-red-500 hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <Trash2 size={16} strokeWidth={3} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="text-center py-12 font-black uppercase text-xl bg-gray-100">
                  No questions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default QuestionForm;