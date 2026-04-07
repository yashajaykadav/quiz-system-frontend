import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';

// Professional Loading Spinner Component
const PageLoader = () => (
  <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center">
    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
    <p className="text-slate-400 font-medium animate-pulse tracking-widest uppercase text-xs">Loading Module...</p>
  </div>
);

// Lazy Loaded Components
const AdminDashboard  = lazy(() => import('./pages/AdminDashboard'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const QuizAttempt = lazy(() => import('./pages/QuizAttempt'));
const OverallResults = lazy(() => import('./pages/OverallResults'));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Suspense is mandatory when using React.lazy */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />

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