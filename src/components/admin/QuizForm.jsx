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
    <div className="p-8 bg-[#eef2ff] min-h-screen font-sans text-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* MAIN FORM COLUMN */}
        <div className="lg:col-span-2 bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="mb-10">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic">
              Create <span className="text-[#3b82f6]">New Quiz</span>
            </h2>
            <div className="h-2 w-24 bg-black mt-1"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">

            {/* SECTION 1: IDENTITY */}
            <section className="space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-black text-white px-2 py-0.5 text-[10px] font-black uppercase italic">01</span>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Identity & Scope</h3>
              </div>

              <input
                type="text"
                placeholder="QUIZ_TITLE_HERE"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-4 border-2 border-black bg-[#f8fafc] font-black focus:outline-none focus:bg-[#dbeafe] transition-colors rounded-none placeholder:text-gray-300"
                required
              />

              <textarea
                placeholder="Detailed assessment parameters..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-4 border-2 border-black font-bold focus:outline-none focus:bg-[#dbeafe] transition-colors rounded-none h-24"
              />
            </section>

            {/* SECTION 2: CLASSIFICATION */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <span className="bg-black text-white px-2 py-0.5 text-[10px] font-black uppercase italic">02</span>
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Classification</h3>
                </div>
                <div className="space-y-4">
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value, topicId: '', questionIds: [] })}
                    className="w-full p-3 border-2 border-black bg-white font-black uppercase text-xs focus:bg-[#dbeafe] outline-none rounded-none cursor-pointer"
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
                    className="w-full p-3 border-2 border-black bg-white font-black uppercase text-xs focus:bg-[#dbeafe] outline-none rounded-none disabled:opacity-30"
                    disabled={!formData.subjectId}
                    required
                  >
                    <option value="">Select Topic</option>
                    {topics.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <span className="bg-black text-white px-2 py-0.5 text-[10px] font-black uppercase italic">03</span>
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Scheduling</h3>
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.durationMinutes}
                      onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
                      className="w-full p-3 border-2 border-black font-mono font-bold focus:bg-[#dbeafe] outline-none"
                      placeholder="Duration (Min)"
                      required
                    />
                    <span className="absolute right-3 top-3 text-[10px] font-black text-gray-400 uppercase">MIN</span>
                  </div>

                  <input
                    type="datetime-local"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="w-full p-3 border-2 border-black font-mono font-bold focus:bg-[#dbeafe] outline-none"
                    required
                  />
                </div>
              </div>
            </section>

            {/* SECTION 3: QUESTION SELECTION */}
            {questions.length > 0 && (
              <section className="space-y-5">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-3">
                    <span className="bg-black text-white px-2 py-0.5 text-[10px] font-black uppercase italic">04</span>
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Asset Selection</h3>
                  </div>
                  <div className="text-[10px] font-black bg-[#3b82f6] text-white px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {formData.questionIds.length} SELECTED
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto border-4 border-black divide-y-2 divide-black bg-gray-50">
                  {questions.map((q) => {
                    const selected = formData.questionIds.includes(q.id);
                    return (
                      <div
                        key={q.id}
                        onClick={() => handleQuestionToggle(q.id)}
                        className={`p-4 cursor-pointer transition-all flex items-start gap-4 ${selected ? 'bg-[#bbf7d0]' : 'bg-white hover:bg-[#f0f9ff]'
                          }`}
                      >
                        <div className={`mt-1 w-5 h-5 border-2 border-black flex-shrink-0 flex items-center justify-center ${selected ? 'bg-black text-white' : 'bg-white'}`}>
                          {selected && <div className="w-2 h-2 bg-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-black uppercase leading-tight">{q.questionText}</div>
                          {q.codeSnippet && (
                            <div className="mt-2 p-2 bg-black text-green-400 font-mono text-[10px] border border-black italic">
                              CODE_SNIPPET_ATTACHED
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3b82f6] text-white py-5 border-4 border-black text-lg font-black uppercase tracking-[0.3em] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all disabled:opacity-50"
            >
              {loading ? 'Transmitting Data...' : 'Finalize & Deploy Quiz'}
            </button>
          </form>
        </div>

        {/* SIDEBAR: EXISTING QUIZZES */}
        <div className="space-y-8">
          <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-2 mb-6 flex justify-between">
              Active Repository <span>({quizzes.length})</span>
            </h3>

            <div className="space-y-4 overflow-y-auto max-h-[700px] pr-2">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="p-4 border-2 border-black bg-[#f8fafc] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(59,130,246,1)] transition-all cursor-default"
                >
                  <h4 className="font-black text-sm uppercase tracking-tight mb-2 leading-tight">
                    {quiz.title}
                  </h4>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black bg-black text-white px-1 italic">SUBJECT</span>
                      <span className="text-[10px] font-bold text-gray-500 truncate uppercase">{quiz.subjectName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black bg-black text-white px-1 italic">DATA_PTS</span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase">{quiz.totalQuestions} Questions</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="font-mono text-[10px] font-black text-[#3b82f6]">{quiz.durationMinutes}M</span>
                    <span className="font-mono text-[9px] font-bold text-gray-400">{quiz.scheduledDate.split('T')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default QuizForm;