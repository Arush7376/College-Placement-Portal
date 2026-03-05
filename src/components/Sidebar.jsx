import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useEffect } from 'react';

const Sidebar = ({ userRole = 'student' }) => {
  const location = useLocation();
  const { isDark, cardBg, text, textSecondary, hover } = useTheme();
  // start collapsed on mobile so the sidebar is hidden by default on small screens
  // but ensure it's always open on large screens (desktop/laptop)
  const isClient = typeof window !== 'undefined';
  const [isCollapsed, setIsCollapsed] = useState(isClient ? window.innerWidth < 1024 : true);
  const [isLargeScreen, setIsLargeScreen] = useState(isClient ? window.innerWidth >= 1024 : false);

  useEffect(() => {
    const handleResize = () => {
      const large = window.innerWidth >= 1024;
      setIsLargeScreen(large);
      // force sidebar open on large screens, collapse on small
      setIsCollapsed(!large);
    };

    window.addEventListener('resize', handleResize);
    // call once to sync
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const studentLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/test-setup', label: 'Take AI Test', icon: '🧠' },
    { path: '/mock-interview-setup', label: 'Mock Interview', icon: '🎤' },
    { path: '/mock-interviews', label: 'Interview History', icon: '📝' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    { path: '/study-plan', label: 'Study Plan', icon: '📚' },
    { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' }
  ];

  const adminLinks = [
    { path: '/admin-dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/student-progress', label: 'Student Progress', icon: '👥' },
    { path: '/question-management', label: 'Questions', icon: '❓' }
  ];

  const links = userRole === 'admin' ? adminLinks : studentLinks;

  return (
    <>
      {/* Mobile Sidebar Toggle (visible on small screens only) */}
      <button
        aria-label={isCollapsed ? 'Open sidebar' : 'Close sidebar'}
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`lg:hidden fixed bottom-24 left-6 z-50 p-3 rounded-lg ${cardBg} ${text} transition-colors shadow-lg hover:shadow-xl`}
      >
        {isCollapsed ? '☰' : '✕'}
      </button>

      {/* Sidebar */}
      <motion.div
        // animate off-canvas only on small screens; always visible on large screens
        initial={isLargeScreen ? { x: 0 } : (isCollapsed ? { x: -300 } : { x: 0 })}
        animate={isLargeScreen ? { x: 0 } : (isCollapsed ? { x: -300 } : { x: 0 })}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`${cardBg} ${text} backdrop-blur-lg border ${isDark ? 'border-white/20' : 'border-gray-200'} 
          fixed lg:relative inset-y-0 left-0 z-40 w-64 h-screen p-4 m-2 sm:m-4 rounded-xl
          transform transition-transform duration-300 ease-in-out
          ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
          lg:translate-x-0`}
        style={{ willChange: 'transform' }}
      >
        <div className="space-y-2 mt-16 lg:mt-0">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${hover} ${location.pathname === link.path
                  ? 'bg-blue-600 ai-glow text-white'
                  : ''
                }`}
              onClick={() => setIsCollapsed(true)}
            >
              <span className="text-xl flex-shrink-0">{link.icon}</span>
              <span className="truncate">{link.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Overlay for mobile when sidebar is open */}
      {!isCollapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-30"
          onClick={() => setIsCollapsed(true)}
          aria-hidden
        />
      )}
    </>
  );
};

export default Sidebar;