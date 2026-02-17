import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import GradientText from './GradientText';
import { useState } from 'react';

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const { 
    isDark, 
    toggleTheme,
    lightThemeVariant,
    changeLightThemeVariant,
    cardBg, 
    text, 
    textSecondary, 
    gradientText,
    glow,
    hover3D
  } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`${cardBg} ${text} p-4 m-2 sm:m-4 rounded-2xl backdrop-blur-lg border ${isDark ? 'border-white/20' : 'border-gray-200'} ${glow} relative overflow-hidden`}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />
      
      <div className="flex justify-between items-center relative z-10">
        <Link to="/" className="flex items-center space-x-2 group">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl"
          >
            🤖
          </motion.div>
          <GradientText 
            variant="primary" 
            className="text-xl sm:text-2xl font-bold group-hover:scale-105 transition-transform duration-300"
          >
            AI PlacementPrep
          </GradientText>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Light Theme Variant Selector */}
          {!isDark && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => changeLightThemeVariant('vibrant')}
                className={`w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 border-2 ${
                  lightThemeVariant === 'vibrant' ? 'border-white' : 'border-transparent'
                } transition-all`}
                title="Vibrant Theme"
              />
              <button
                onClick={() => changeLightThemeVariant('soft')}
                className={`w-6 h-6 rounded-full bg-gradient-to-r from-pink-300 to-blue-300 border-2 ${
                  lightThemeVariant === 'soft' ? 'border-white' : 'border-transparent'
                } transition-all`}
                title="Soft Theme"
              />
              <button
                onClick={() => changeLightThemeVariant('pastel')}
                className={`w-6 h-6 rounded-full bg-gradient-to-r from-yellow-200 to-pink-200 border-2 ${
                  lightThemeVariant === 'pastel' ? 'border-white' : 'border-transparent'
                } transition-all`}
                title="Pastel Theme"
              />
            </div>
          )}
          
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={`p-3 rounded-xl transition-all duration-300 ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} ${hover3D}`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <motion.div
              animate={{ rotate: isDark ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              {isDark ? '☀️' : '🌙'}
            </motion.div>
          </motion.button>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`${textSecondary} hidden sm:flex items-center space-x-2`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.name.charAt(0)}
                </div>
                <span>Welcome, {user.name}</span>
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 px-6 py-2 rounded-xl transition-all duration-300 text-white font-semibold shadow-lg hover:shadow-xl"
              >
                Logout
              </motion.button>
            </div>
          ) : (
            <div className="flex space-x-3">
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-2 rounded-xl transition-all duration-300 text-white font-semibold shadow-lg hover:shadow-xl"
                >
                  Login
                </motion.button>
              </Link>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`border-2 px-6 py-2 rounded-xl transition-all duration-300 font-semibold backdrop-blur-sm ${
                    isDark 
                      ? 'border-blue-500 hover:bg-blue-500 text-blue-400 hover:text-white'
                      : 'border-blue-700 hover:bg-blue-700 text-blue-700 hover:text-white bg-white/80'
                  }`}
                >
                  Register
                </motion.button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
          >
            {isDark ? '☀️' : '🌙'}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <motion.span 
                className={`block w-5 h-0.5 ${isDark ? 'bg-white' : 'bg-gray-900'} transition-all`}
                animate={{
                  rotate: isMobileMenuOpen ? 45 : 0,
                  y: isMobileMenuOpen ? 6 : 0
                }}
              />
              <motion.span 
                className={`block w-5 h-0.5 ${isDark ? 'bg-white' : 'bg-gray-900'} mt-1 transition-all`}
                animate={{
                  opacity: isMobileMenuOpen ? 0 : 1
                }}
              />
              <motion.span 
                className={`block w-5 h-0.5 ${isDark ? 'bg-white' : 'bg-gray-900'} mt-1 transition-all`}
                animate={{
                  rotate: isMobileMenuOpen ? -45 : 0,
                  y: isMobileMenuOpen ? -6 : 0
                }}
              />
            </div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isMobileMenuOpen ? 1 : 0, 
          height: isMobileMenuOpen ? 'auto' : 0 
        }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden"
      >
        <div className="mt-4 pt-4 border-t border-white/20 space-y-3">
          {user ? (
            <>
              <div className={`${textSecondary} text-sm flex items-center space-x-2`}>
                <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <span>Welcome, {user.name}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 px-4 py-3 rounded-xl transition-all duration-300 text-white font-semibold"
              >
                Logout
              </motion.button>
            </>
          ) : (
            <div className="space-y-2">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-3 rounded-xl transition-all duration-300 text-white text-center font-semibold"
                >
                  Login
                </motion.button>
              </Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`block w-full border-2 px-4 py-3 rounded-xl transition-all duration-300 text-center font-semibold backdrop-blur-sm ${
                    isDark 
                      ? 'border-blue-500 hover:bg-blue-500 text-blue-400 hover:text-white'
                      : 'border-blue-700 hover:bg-blue-700 text-blue-700 hover:text-white bg-white/80'
                  }`}
                >
                  Register
                </motion.button>
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;