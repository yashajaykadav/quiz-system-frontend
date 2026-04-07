import api from './axios';

export const studentApi = {
  getTodayQuizzes: () => api.get('/student/quizzes/today'),
  startQuiz: (quizId) => api.post(`/student/quizzes/${quizId}/start`),
  submitAnswer: (attemptId, data) => api.post(`/student/attempts/${attemptId}/answer`, data),
  getAttempt: (attemptId) => api.get(`/student/attempts/${attemptId}`),
  getAttemptAnswers: (attemptId) => api.get(`/student/attempts/${attemptId}/answers`),
  submitQuiz: (attemptId) => api.post(`/student/attempts/${attemptId}/submit`),
  recordWarning: (attemptId) => api.post(`/student/attempts/${attemptId}/warning`),
  getOverallPerformance: () => api.get('/student/performance'),
};