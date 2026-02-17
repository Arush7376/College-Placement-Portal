import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from '../components/Sidebar';
import mockResults from '../data/mockResults.json';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Analytics = () => {
  const { performanceData } = mockResults;
  const { isDark, cardBg, text, textSecondary } = useTheme();

  // Subject-wise accuracy chart data
  const subjectAccuracyData = {
    labels: Object.keys(performanceData.subjectAccuracy),
    datasets: [
      {
        label: 'Accuracy (%)',
        data: Object.values(performanceData.subjectAccuracy),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 101, 101, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 101, 101, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(139, 92, 246, 1)'
        ],
        borderWidth: 2,
        borderRadius: 8,
      }
    ]
  };

  // Interview scores chart data
  const interviewScoreData = {
    labels: performanceData.interviewScores.map(score => score.date),
    datasets: [
      {
        label: 'Interview Score',
        data: performanceData.interviewScores.map(score => score.score),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDark ? '#fff' : '#374151',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDark ? '#9CA3AF' : '#6B7280'
        },
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        ticks: {
          color: isDark ? '#9CA3AF' : '#6B7280'
        },
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  const StatCard = ({ title, value, change, icon, color = 'blue' }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`${cardBg} ${text} p-4 sm:p-6 rounded-xl backdrop-blur-lg border ${isDark ? 'border-white/20' : 'border-gray-200'}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className={`${textSecondary} text-xs sm:text-sm truncate`}>{title}</p>
          <p className={`text-2xl sm:text-3xl font-bold text-${color}-500 truncate`}>{value}</p>
          {change && (
            <p className={`text-xs sm:text-sm ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change > 0 ? '↗' : '↘'} {Math.abs(change)}% from last week
            </p>
          )}
        </div>
        <div className="text-3xl sm:text-4xl ml-2 flex-shrink-0">{icon}</div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      
      <div className="flex-1 p-4 sm:p-6 lg:ml-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <h1 className={`text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 ${text} px-2`}>
            Performance Analytics 📊
          </h1>
          
          {/* Overview Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <StatCard
              title="Overall Score"
              value="82%"
              change={5}
              icon="🎯"
              color="blue"
            />
            <StatCard
              title="Tests Taken"
              value="24"
              change={12}
              icon="📝"
              color="green"
            />
            <StatCard
              title="Interview Score"
              value="85%"
              change={8}
              icon="🎤"
              color="purple"
            />
            <StatCard
              title="Rank"
              value="#12"
              change={-3}
              icon="🏆"
              color="yellow"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Subject-wise Accuracy */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`${cardBg} ${text} p-4 sm:p-6 rounded-xl backdrop-blur-lg border ${isDark ? 'border-white/20' : 'border-gray-200'}`}
            >
              <h2 className="text-lg sm:text-xl font-bold mb-4">Subject-wise Accuracy</h2>
              <div className="h-48 sm:h-64">
                <Bar data={subjectAccuracyData} options={chartOptions} />
              </div>
            </motion.div>

            {/* Interview Score Trend */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={`${cardBg} ${text} p-4 sm:p-6 rounded-xl backdrop-blur-lg border ${isDark ? 'border-white/20' : 'border-gray-200'}`}
            >
              <h2 className="text-lg sm:text-xl font-bold mb-4">Interview Score Trend</h2>
              <div className="h-48 sm:h-64">
                <Line data={interviewScoreData} options={chartOptions} />
              </div>
            </motion.div>
          </div>

          {/* Detailed Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Weak Areas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`${cardBg} ${text} p-4 sm:p-6 rounded-xl backdrop-blur-lg border ${isDark ? 'border-white/20' : 'border-gray-200'}`}
            >
              <h2 className="text-lg sm:text-xl font-bold mb-4">Areas to Improve</h2>
              <div className="space-y-3 sm:space-y-4">
                {performanceData.weakAreas.map((area, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                      <span className="text-sm sm:text-base truncate">{area}</span>
                    </div>
                    <span className="text-red-500 text-xs sm:text-sm flex-shrink-0 ml-2">Needs work</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 sm:mt-6">
                <button className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg transition-colors text-sm sm:text-base">
                  Generate Study Plan
                </button>
              </div>
            </motion.div>

            {/* Strengths */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`${cardBg} ${text} p-4 sm:p-6 rounded-xl backdrop-blur-lg border ${isDark ? 'border-white/20' : 'border-gray-200'}`}
            >
              <h2 className="text-lg sm:text-xl font-bold mb-4">Your Strengths</h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm sm:text-base truncate">Aptitude</span>
                  </div>
                  <span className="text-green-500 text-sm font-bold flex-shrink-0 ml-2">92%</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm sm:text-base truncate">Core Subjects</span>
                  </div>
                  <span className="text-green-500 text-sm font-bold flex-shrink-0 ml-2">85%</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm sm:text-base truncate">Communication</span>
                  </div>
                  <span className="text-green-500 text-sm font-bold flex-shrink-0 ml-2">88%</span>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className={`${cardBg} ${text} p-4 sm:p-6 rounded-xl backdrop-blur-lg border ${isDark ? 'border-white/20' : 'border-gray-200'}`}
            >
              <h2 className="text-lg sm:text-xl font-bold mb-4">Recent Activity</h2>
              <div className="space-y-3 sm:space-y-4">
                <div className={`flex items-center space-x-3 p-3 ${isDark ? 'bg-white/5' : 'bg-gray-50'} rounded-lg`}>
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    🧠
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">DSA Test</p>
                    <p className={`text-xs sm:text-sm ${textSecondary}`}>2 hours ago</p>
                  </div>
                  <span className="text-blue-500 font-bold text-sm flex-shrink-0">85%</span>
                </div>
                
                <div className={`flex items-center space-x-3 p-3 ${isDark ? 'bg-white/5' : 'bg-gray-50'} rounded-lg`}>
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    🎤
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">Mock Interview</p>
                    <p className={`text-xs sm:text-sm ${textSecondary}`}>1 day ago</p>
                  </div>
                  <span className="text-green-500 font-bold text-sm flex-shrink-0">88%</span>
                </div>
                
                <div className={`flex items-center space-x-3 p-3 ${isDark ? 'bg-white/5' : 'bg-gray-50'} rounded-lg`}>
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    📚
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">Study Session</p>
                    <p className={`text-xs sm:text-sm ${textSecondary}`}>2 days ago</p>
                  </div>
                  <span className="text-purple-500 font-bold text-sm flex-shrink-0">2h</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;