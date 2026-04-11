import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';
import Contact from './pages/Contact';

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
      <p className="text-sm text-gray-600">Loading...</p>
    </div>
  </div>
);

// Lazy Loaded Components
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const QuizAttempt = lazy(() => import('./pages/QuizAttempt'));
const OverallResults = lazy(() => import('./pages/OverallResults'));
// Lazy loading used to improve performance by loading pages only when needed
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Suspense is mandatory when using React.lazy */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin Access Control */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Student Access Control */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/quiz/:quizId"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <QuizAttempt />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/results"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <OverallResults />
                </ProtectedRoute>
              }
            />

            {/* Global Redirects */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;