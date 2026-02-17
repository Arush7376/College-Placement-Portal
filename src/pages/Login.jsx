import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import Button from '../components/Button';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });
  const navigate = useNavigate();
  const { isDark, cardBg, text, textSecondary, input } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const user = {
      id: 1,
      name: formData.role === 'admin' ? 'Admin User' : 'John Doe',
      email: formData.email,
      role: formData.role
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    
    if (formData.role === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/dashboard');
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
              <option value="student">Student</option>
              <option value="admin">Placement Head</option>
            </select>
          </div>

          <Button type="submit" className="w-full">
            Sign In
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