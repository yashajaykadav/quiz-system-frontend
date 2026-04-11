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
    <div className="p-8 bg-[#eef2ff] min-h-screen font-sans text-black">
      {/* TOAST - Floating sticker style */}
      {toast.visible && (
        <div
          className={`fixed top-10 right-10 px-6 py-3 border-4 border-black font-black uppercase tracking-widest text-xs z-[100] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] translate-y-0 animate-bounce ${toast.type === 'success' ? 'bg-[#22c55e] text-white' : 'bg-[#ef4444] text-white'
            }`}
        >
          {toast.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">

        {/* FORM SECTION */}
        <div className="lg:col-span-2 bg-white border-2 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
          <div className="mb-8">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">
              Add <span className="text-[#3b82f6]">Question</span>
            </h2>
            <div className="h-1.5 w-16 bg-black mt-1"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* SUBJECT + TOPIC - Blueprint layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-[10px] font-black uppercase tracking-widest mb-2 text-gray-500">Classification</label>
                <select
                  value={formData.subjectId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subjectId: e.target.value,
                      topicId: '',
                    })
                  }
                  className="p-3 border-2 border-black bg-[#f8fafc] font-bold focus:bg-[#dbeafe] outline-none rounded-none cursor-pointer"
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map((s) => (
                    <option key={s.id || s._id} value={s.id || s._id}>
                      {s.name.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-black uppercase tracking-widest mb-2 text-gray-500">Specific Topic</label>
                <select
                  value={formData.topicId}
                  onChange={(e) =>
                    setFormData({ ...formData, topicId: e.target.value })
                  }
                  className="p-3 border-2 border-black bg-[#f8fafc] font-bold focus:bg-[#dbeafe] outline-none rounded-none disabled:opacity-30 cursor-pointer"
                  disabled={!formData.subjectId}
                  required
                >
                  <option value="">Select Topic</option>
                  {topics.map((t) => (
                    <option key={t.id || t._id} value={t.id || t._id}>
                      {t.name.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* QUESTION TEXT */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest mb-2 text-gray-500">Interrogative Content</label>
              <textarea
                placeholder="What is the root cause of..."
                value={formData.questionText}
                onChange={(e) =>
                  setFormData({ ...formData, questionText: e.target.value })
                }
                className="w-full p-4 border-2 border-black font-bold focus:bg-[#dbeafe] outline-none rounded-none min-h-[100px]"
                required
              />
            </div>

            {/* CODE SNIPPET */}
            <div className="bg-gray-50 border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <label className="text-[10px] font-black uppercase tracking-widest mb-2 block">Optional Code Snippet</label>
              <textarea
                placeholder="// Paste technical context here..."
                value={formData.codeSnippet}
                onChange={(e) =>
                  setFormData({ ...formData, codeSnippet: e.target.value })
                }
                className="w-full p-3 border-2 border-black font-mono text-sm bg-black text-green-400 focus:outline-none rounded-none"
                rows="4"
              />
            </div>

            {/* OPTIONS GRID */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-gray-600">
                Response Configuration (Select Truth)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((num) => {
                  const selected = formData.correctOption === num;

                  return (
                    <div
                      key={num}
                      onClick={() => setFormData({ ...formData, correctOption: num })}
                      className={`group flex items-center gap-3 p-3 border-2 border-black cursor-pointer transition-all ${selected
                          ? 'bg-[#bbf7d0] shadow-none translate-x-[2px] translate-y-[2px]'
                          : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#f0f9ff]'
                        }`}
                    >
                      <div className={`w-6 h-6 border-2 border-black flex items-center justify-center font-black text-xs ${selected ? 'bg-black text-white' : 'bg-white text-black'}`}>
                        {num}
                      </div>

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
                        className="w-full bg-transparent text-sm font-bold focus:outline-none placeholder:text-gray-400"
                        required
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3b82f6] text-white py-4 border-2 border-black text-sm font-black uppercase tracking-[0.3em] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] active:bg-black transition-all disabled:opacity-50"
            >
              {loading ? 'Transmitting Data...' : 'Confirm & Deploy Question'}
            </button>
          </form>
        </div>

        {/* LIST SECTION - Sidebar style */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-2 mb-4">
              Recently Cached ({questions.length})
            </h3>

            <div className="max-h-[600px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {questions.length === 0 ? (
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center py-10 italic">
                  No local records found
                </p>
              ) : (
                questions.map((q) => (
                  <div
                    key={q.id || q._id}
                    className="p-3 border-2 border-black bg-[#f8fafc] hover:bg-[#dbeafe] transition-colors cursor-default"
                  >
                    <div className="text-[11px] font-black uppercase leading-tight line-clamp-2">
                      {q.questionText}
                    </div>

                    {q.codeSnippet && (
                      <div className="inline-block mt-2 px-1.5 py-0.5 bg-black text-[#3b82f6] text-[8px] font-black uppercase tracking-tighter">
                        Has_Code_Snippet
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default QuestionForm;