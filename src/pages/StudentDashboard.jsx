import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import mockStudents from '../data/mockStudents.json';

const StudentDashboard = () => {
  const currentUser = mockStudents.students[0];
  const { isDark, cardBg, text, textSecondary, hover } = useTheme();

  const CircularProgress = ({ percentage, size = 120 }) => {
    const radius = (size - 10) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative flex justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
            strokeWidth="8"
            fill="none"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#3b82f6"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-500">{percentage}%</div>
            <div className={`text-xs ${textSecondary}`}>Ready</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      
      <div className="flex-1 p-4 sm:p-6 lg:ml-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <h1 className={`text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 ${text} px-2`}>
            Welcome back, {currentUser.name}! 👋
          </h1>
          
          {/* Readiness Score and Progress Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Readiness Score */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`lg:col-span-1 ${cardBg} ${text} p-4 sm:p-6 rounded-xl text-center ai-glow backdrop-blur-lg border ${isDark ? 'border-white/20' : 'border-gray-200'}`}
            >
              <h3 className="text-base sm:text-lg font-semibold mb-4">Placement Readiness</h3>
              <div className="flex justify-center mb-4">
                <CircularProgress percentage={currentUser.readinessScore} size={window.innerWidth < 640 ? 100 : 120} />
              </div>
              <p className={`text-xs sm:text-sm ${textSecondary} px-2`}>
                You're doing great! Keep practicing to improve your score.
              </p>
            </motion.div>

            {/* Progress Cards */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <StatCard
                title="DSA Progress"
                value={`${currentUser.dsaProgress}%`}
                icon="🧠"
                color="blue"
                progress={currentUser.dsaProgress}
              />
              <StatCard
                title="Aptitude Progress"
                value={`${currentUser.aptitudeProgress}%`}
                icon="🔢"
                color="green"
                progress={currentUser.aptitudeProgress}
              />
              <StatCard
                title="Core Subjects"
                value={`${currentUser.coreSubjectsProgress}%`}
                icon="📚"
                color="purple"
                progress={currentUser.coreSubjectsProgress}
              />
            </div>
          </div>

          {/* Recent Activity and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Recent Test Results */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`${cardBg} ${text} p-4 sm:p-6 rounded-xl backdrop-blur-lg border ${isDark ? 'border-white/20' : 'border-gray-200'}`}
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Recent Test Results</h3>
              <div className="space-y-3 sm:space-y-4">
                {currentUser.recentTests.map((test, index) => (
                  <div key={index} className={`flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 ${isDark ? 'bg-white/5' : 'bg-gray-50'} rounded-lg gap-2 sm:gap-0`}>
                    <div>
                      <p className="font-medium text-sm sm:text-base">{test.subject}</p>
                      <p className={`text-xs sm:text-sm ${textSecondary}`}>{test.date}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-base sm:text-lg font-bold text-blue-500">{test.score}%</p>
                      <p className={`text-xs ${textSecondary}`}>Score</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={`${cardBg} ${text} p-4 sm:p-6 rounded-xl backdrop-blur-lg border ${isDark ? 'border-white/20' : 'border-gray-200'}`}
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className={`w-full p-3 sm:p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-left`}>
                  <div className="flex items-center space-x-3">
                    <span className="text-xl sm:text-2xl">🧠</span>
                    <div>
                      <p className="font-medium text-sm sm:text-base">Take AI Test</p>
                      <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-300' : 'text-gray-200'}`}>Practice with adaptive questions</p>
                    </div>
                  </div>
                </button>
                
                <button className={`w-full p-3 sm:p-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-left`}>
                  <div className="flex items-center space-x-3">
                    <span className="text-xl sm:text-2xl">🎤</span>
                    <div>
                      <p className="font-medium text-sm sm:text-base">Mock Interview</p>
                      <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-300' : 'text-gray-200'}`}>Practice with AI interviewer</p>
                    </div>
                  </div>
                </button>
                
                <button className={`w-full p-3 sm:p-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-left`}>
                  <div className="flex items-center space-x-3">
                    <span className="text-xl sm:text-2xl">📚</span>
                    <div>
                      <p className="font-medium text-sm sm:text-base">Study Plan</p>
                      <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-300' : 'text-gray-200'}`}>Get personalized roadmap</p>
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;