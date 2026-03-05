import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import StudentDashboard from '../pages/StudentDashboard';
import AITestSetup from '../pages/AITestSetup';
import TestPage from '../pages/TestPage';
import MockInterviewSetup from '../pages/MockInterviewSetup';
import MockInterview from '../pages/MockInterview';
import Analytics from '../pages/Analytics';
import StudyPlan from '../pages/StudyPlan';
import Leaderboard from '../pages/Leaderboard';
import AdminDashboard from '../pages/AdminDashboard';
import StudentProgress from '../pages/StudentProgress';
import QuestionManagement from '../pages/QuestionManagement';
import TestResults from '../pages/TestResults';
import InterviewResults from '../pages/InterviewResults';
import MockInterviewList from '../pages/MockInterviewList';

const AppRoutes = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const ProtectedRoute = ({ children, adminOnly = false }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (adminOnly && user.role !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }

    return children;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/test-setup"
        element={
          <ProtectedRoute>
            <AITestSetup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/test"
        element={
          <ProtectedRoute>
            <TestPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mock-interview-setup"
        element={
          <ProtectedRoute>
            <MockInterviewSetup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mock-interview"
        element={
          <ProtectedRoute>
            <MockInterview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/study-plan"
        element={
          <ProtectedRoute>
            <StudyPlan />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/test-results"
        element={
          <ProtectedRoute>
            <TestResults />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview-results"
        element={
          <ProtectedRoute>
            <InterviewResults />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mock-interviews"
        element={
          <ProtectedRoute>
            <MockInterviewList />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-progress"
        element={
          <ProtectedRoute adminOnly>
            <StudentProgress />
          </ProtectedRoute>
        }
      />
      <Route
        path="/question-management"
        element={
          <ProtectedRoute adminOnly>
            <QuestionManagement />
          </ProtectedRoute>
        }
      />

      {/* Redirect based on user role */}
      <Route
        path="/dashboard-redirect"
        element={
          user?.role === 'admin'
            ? <Navigate to="/admin-dashboard" replace />
            : <Navigate to="/dashboard" replace />
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;