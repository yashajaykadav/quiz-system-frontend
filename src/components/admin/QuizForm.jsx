import { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';

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
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* FORM */}
      <div className="lg:col-span-2 bg-white border rounded shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-5">Create Quiz</h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* BASIC INFO */}
          <div>
            <h3 className="font-medium mb-2">Basic Info</h3>

            <input
              type="text"
              placeholder="Quiz Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-2 border rounded mb-3"
              required
            />

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>

          {/* SUBJECT + TOPIC */}
          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.subjectId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subjectId: e.target.value,
                  topicId: '',
                  questionIds: [],
                })
              }
              className="p-2 border rounded"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <select
              value={formData.topicId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  topicId: e.target.value,
                  questionIds: [],
                })
              }
              className="p-2 border rounded"
              disabled={!formData.subjectId}
              required
            >
              <option value="">Select Topic</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* TIME + DATE */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={formData.durationMinutes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  durationMinutes: parseInt(e.target.value),
                })
              }
              className="p-2 border rounded"
              min="1"
              placeholder="Duration (minutes)"
              required
            />

            <input
              type="datetime-local"
              value={formData.scheduledDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  scheduledDate: e.target.value,
                })
              }
              className="p-2 border rounded"
              required
            />
          </div>

          {/* QUESTIONS */}
          {questions.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">
                Questions ({formData.questionIds.length} selected)
              </h3>

              <div className="max-h-72 overflow-y-auto border rounded p-3 space-y-2">
                {questions.map((q) => {
                  const selected = formData.questionIds.includes(q.id);

                  return (
                    <div
                      key={q.id}
                      onClick={() => handleQuestionToggle(q.id)}
                      className={`p-2 border rounded cursor-pointer
                      ${selected
                          ? 'bg-green-100 border-green-400'
                          : 'hover:bg-gray-50'}
                    `}
                    >
                      <div className="font-medium">
                        {q.questionText}
                      </div>

                      {q.codeSnippet && (
                        <pre className="text-xs bg-gray-100 p-2 mt-2 rounded overflow-x-auto">
                          {q.codeSnippet}
                        </pre>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {loading ? 'Creating...' : 'Create Quiz'}
          </button>
        </form>
      </div>

      {/* QUIZ LIST */}
      <div className="bg-white border rounded shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">
          Existing Quizzes ({quizzes.length})
        </h3>

        <div className="space-y-3">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="p-3 border rounded hover:bg-gray-50"
            >
              <h4 className="font-semibold">{quiz.title}</h4>

              <div className="text-sm text-gray-600">
                {quiz.subjectName} | {quiz.topicName}
              </div>

              <div className="text-sm text-gray-600">
                Duration: {quiz.durationMinutes} mins
              </div>

              <div className="text-sm text-gray-600">
                Date: {quiz.scheduledDate}
              </div>

              <div className="text-sm mt-1">
                Questions: {quiz.totalQuestions}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default QuizForm;