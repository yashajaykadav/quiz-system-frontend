import { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';

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
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* TOAST */}
      {toast.visible && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded shadow text-white text-sm ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
        >
          {toast.message}
        </div>
      )}

      {/* FORM */}
      <div className="lg:col-span-2 bg-white border rounded shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-5">Add Question</h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* SUBJECT + TOPIC */}
          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.subjectId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subjectId: e.target.value,
                  topicId: '',
                })
              }
              className="p-2 border rounded"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map((s) => (
                <option key={s.id || s._id} value={s.id || s._id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              value={formData.topicId}
              onChange={(e) =>
                setFormData({ ...formData, topicId: e.target.value })
              }
              className="p-2 border rounded"
              disabled={!formData.subjectId}
              required
            >
              <option value="">Select Topic</option>
              {topics.map((t) => (
                <option key={t.id || t._id} value={t.id || t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* QUESTION */}
          <textarea
            placeholder="Enter question"
            value={formData.questionText}
            onChange={(e) =>
              setFormData({ ...formData, questionText: e.target.value })
            }
            className="w-full p-2 border rounded"
            rows="3"
            required
          />

          {/* CODE */}
          <div>
            <textarea
              placeholder="Optional code snippet"
              value={formData.codeSnippet}
              onChange={(e) =>
                setFormData({ ...formData, codeSnippet: e.target.value })
              }
              className="w-full p-2 border rounded font-mono text-sm"
              rows="4"
            />

            {formData.codeSnippet && (
              <pre className="bg-gray-100 p-2 mt-2 rounded text-xs overflow-x-auto">
                {formData.codeSnippet}
              </pre>
            )}
          </div>

          {/* OPTIONS */}
          <div>
            <h3 className="font-medium mb-2">
              Options (select correct answer)
            </h3>

            <div className="space-y-2">
              {[1, 2, 3, 4].map((num) => {
                const selected = formData.correctOption === num;

                return (
                  <div
                    key={num}
                    onClick={() =>
                      setFormData({ ...formData, correctOption: num })
                    }
                    className={`flex items-center gap-2 p-2 border rounded cursor-pointer ${selected ? 'bg-green-100 border-green-400' : ''
                      }`}
                  >
                    <input
                      type="radio"
                      checked={selected}
                      readOnly
                    />

                    <input
                      type="text"
                      placeholder={`Option ${num}`}
                      value={formData[`option${num}`]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [`option${num}`]: e.target.value,
                        })
                      }
                      className="w-full p-1 border rounded"
                      required
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white ${loading
              ? 'bg-gray-400'
              : 'bg-blue-500 hover:bg-blue-600'
              }`}
          >
            {loading ? 'Processing...' : 'Add Question'}
          </button>

        </form>
      </div>

      {/* LIST */}
      <div className="bg-white border rounded shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">
          Recent Questions ({questions.length})
        </h3>

        <div className="max-h-[500px] overflow-y-auto space-y-2">
          {questions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No questions found
            </p>
          ) : (
            questions.map((q) => (
              <div
                key={q.id || q._id}
                className="p-2 border rounded bg-gray-50"
              >
                <div className="text-sm font-medium line-clamp-2">
                  {q.questionText}
                </div>

                {q.codeSnippet && (
                  <div className="text-xs text-blue-600 mt-1">
                    Code snippet included
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default QuestionForm;