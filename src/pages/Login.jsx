import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import Button from '../components/Button';
import { authAPI } from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'STUDENT'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isDark, cardBg, text, textSecondary, input } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use email as username for login
      const response = await authAPI.login(formData.email, formData.password);

      const { access, refresh } = response.data;

      // Decode token or fetch profile to get user details/role
      // For now, we'll fetch profile immediately after login
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh); // Store refresh token

      // Temporarily store a basic user object to satisfy existing app logic
      // Ideally we fetch the real profile here
      const userProfile = {
        name: formData.email.split('@')[0],
        email: formData.email,
        role: formData.role, // This should come from backend ideally
        access: access,
        refresh: refresh
      };
      localStorage.setItem('user', JSON.stringify(userProfile));
      window.dispatchEvent(new Event('userChanged'));

      if (formData.role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Login failed", err);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`${cardBg} ${text} p-6 sm:p-8 rounded-2xl w-full max-w-md backdrop-blur-lg border ${isDark ? 'border-white/20' : 'border-gray-200'}`}
      >
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome Back</h1>
          <p className={`${textSecondary} text-sm sm:text-base`}>Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 ${input} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm sm:text-base`}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-3 ${input} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm sm:text-base`}
              placeholder="Enter your password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full p-3 ${input} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm sm:text-base`}
            >
              <option value="STUDENT">Student</option>
              <option value="ADMIN">Placement Head</option>
            </select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="text-center mt-4 sm:mt-6">
          <p className={`${textSecondary} text-sm sm:text-base`}>
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:text-blue-400 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;