import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useContext } from 'react';

import { AuthProvider } from './context/AuthContext';
import AuthContext from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';

import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ReflectionPage from './pages/ReflectionPage';
import RewardsStorePage from './pages/RewardsStorePage';
import MyReflectionsPage from './pages/MyReflectionsPage';
import PublicReflectionPage from './pages/PublicReflectionPage';

function AppContent() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const isPublicPage = location.pathname.startsWith('/public') || location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';

  if (user && !isPublicPage) {
    // Logged-in layout with sidebar
    return (
      <div className="flex bg-gray-900 text-white min-h-screen">
        <Sidebar />
        <main className="flex-grow p-8">
          <Routes>
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/reflection/:questId" element={<PrivateRoute><ReflectionPage /></PrivateRoute>} />
            <Route path="/rewards" element={<PrivateRoute><RewardsStorePage /></PrivateRoute>} />
            <Route path="/my-reflections" element={<PrivateRoute><MyReflectionsPage /></PrivateRoute>} />
            <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          </Routes>
        </main>
      </div>
    );
  } else {
    // Public/auth layout (no sidebar)
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <Routes>
          <Route path="/public/reflection/:reflectionId" element={<PublicReflectionPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    );
  }
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
