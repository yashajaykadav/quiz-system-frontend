import api from './axios';

export const adminApi = {
  // Subjects
  createSubject: (data) => api.post('/admin/subjects', data),
  getAllSubjects: () => api.get('/admin/subjects'),
  deleteSubject: (id) => api.delete(`/admin/subjects/${id}`),

  // Topics
  createTopic: (data) => api.post('/admin/topics', data),
  getAllTopics: () => api.get('/admin/topics'),
  getTopicsBySubject: (subjectId) => api.get(`/admin/topics/subject/${subjectId}`),
  deleteTopic: (id) => api.delete(`/admin/topics/${id}`),

  // Questions
  createQuestion: (data) => api.post('/admin/questions', data),
  getAllQuestions: () => api.get('/admin/questions'),
  getQuestionsByFilter: (subjectId, topicId) =>
    api.get(`/admin/questions/filter?subjectId=${subjectId}&topicId=${topicId}`),
  deleteQuestion: (id) => api.delete(`/admin/questions/${id}`),

  // Quizzes
  createQuiz: (data) => api.post('/admin/quizzes', data),
  getAllQuizzes: () => api.get('/admin/quizzes'),
  deleteQuiz: (id) => api.delete(`/admin/quizzes/${id}`),
};