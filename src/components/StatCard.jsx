import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const StatCard = ({ title, value, icon, color = 'primary', progress }) => {
  const { isDark, cardBg, text, textSecondary } = useTheme();
  
  const colorClasses = {
    primary: 'text-blue-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    yellow: 'text-yellow-500',
    red: 'text-red-500'
  };

  const progressColorClasses = {
    primary: 'bg-blue-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`${cardBg} ${text} p-4 sm:p-6 rounded-xl ai-glow backdrop-blur-lg border ${isDark ? 'border-white/20' : 'border-gray-200'}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className={`${textSecondary} text-xs sm:text-sm truncate`}>{title}</p>
          <p className={`text-2xl sm:text-3xl font-bold ${colorClasses[color]} truncate`}>{value}</p>
        </div>
        <div className="text-3xl sm:text-4xl ml-2 flex-shrink-0">{icon}</div>
      </div>
      
      {progress !== undefined && (
        <div className="mt-4">
          <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-300'} rounded-full h-2`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`${progressColorClasses[color]} h-2 rounded-full`}
            />
          </div>
          <p className={`text-xs ${textSecondary} mt-1`}>{progress}% Complete</p>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;