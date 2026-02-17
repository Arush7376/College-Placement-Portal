import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import mockStudents from '../data/mockStudents.json';

const Leaderboard = () => {
  const { students, currentUser } = mockStudents;
  
  // Sort students by readiness score
  const sortedStudents = [...students].sort((a, b) => b.readinessScore - a.readinessScore);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏅';
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-gray-400';
      case 3: return 'text-orange-500';
      default: return 'text-blue-500';
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      
      <div className="flex-1 p-4 sm:p-6 md:p-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8">Leaderboard 🏆</h1>
          
          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {sortedStudents.slice(0, 3).map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`glass-card p-6 rounded-xl text-center ${
                  student.id === currentUser.id ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <div className="text-4xl sm:text-5xl md:text-6xl mb-4">{getRankIcon(index + 1)}</div>
                <h3 className="text-xl font-bold mb-2">{student.name}</h3>
                <p className={`text-2xl sm:text-3xl font-bold mb-2 ${getRankColor(index + 1)}`}>
                  {student.readinessScore}%
                </p>
                <p className="text-gray-400">Readiness Score</p>
                
                <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-blue-500 font-bold">{student.dsaProgress}%</p>
                    <p className="text-gray-400">DSA</p>
                  </div>
                  <div>
                    <p className="text-green-500 font-bold">{student.aptitudeProgress}%</p>
                    <p className="text-gray-400">Aptitude</p>
                  </div>
                  <div>
                    <p className="text-purple-500 font-bold">{student.coreSubjectsProgress}%</p>
                    <p className="text-gray-400">Core</p>
                  </div>
                </div>
                
                {student.id === currentUser.id && (
                  <div className="mt-4 bg-primary-500/20 border border-primary-500 rounded-lg p-2">
                    <p className="text-primary-500 font-bold text-sm">That's You! 🎉</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Full Leaderboard Table (table on md+, stacked list on mobile) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card rounded-xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold">Full Rankings</h2>
              <p className="text-gray-400">Complete leaderboard with all students</p>
            </div>

            {/* Mobile: stacked cards */}
            <div className="md:hidden p-4 space-y-3">
              {sortedStudents.map((student, index) => (
                <div key={student.id} className={`p-4 rounded-lg border ${student.id === currentUser.id ? 'border-primary-500 bg-primary-500/10' : 'border-white/5'} `}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold">{student.name}</div>
                        <div className="text-sm text-gray-400">{student.email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary-500">{student.readinessScore}%</div>
                      <div className="text-xs text-gray-400">#{index + 1}</div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-sm text-center">
                    <div>
                      <div className="text-blue-500 font-bold">{student.dsaProgress}%</div>
                      <div className="text-gray-400">DSA</div>
                    </div>
                    <div>
                      <div className="text-green-500 font-bold">{student.aptitudeProgress}%</div>
                      <div className="text-gray-400">Aptitude</div>
                    </div>
                    <div>
                      <div className="text-purple-500 font-bold">{student.coreSubjectsProgress}%</div>
                      <div className="text-gray-400">Core</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop/Tablet: table view */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left">Rank</th>
                    <th className="px-6 py-4 text-left">Student</th>
                    <th className="px-6 py-4 text-center">Readiness Score</th>
                    <th className="px-6 py-4 text-center">DSA</th>
                    <th className="px-6 py-4 text-center">Aptitude</th>
                    <th className="px-6 py-4 text-center">Core Subjects</th>
                    <th className="px-6 py-4 text-center">Percentile</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStudents.map((student, index) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                        student.id === currentUser.id ? 'bg-primary-500/10 border-primary-500/20' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{getRankIcon(index + 1)}</span>
                          <span className={`font-bold ${getRankColor(index + 1)}`}>
                            #{index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-gray-400">{student.email}</p>
                          </div>
                          {student.id === currentUser.id && (
                            <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <div className="text-2xl font-bold text-primary-500">
                            {student.readinessScore}%
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-blue-500 font-bold">{student.dsaProgress}%</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-green-500 font-bold">{student.aptitudeProgress}%</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-purple-500 font-bold">{student.coreSubjectsProgress}%</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-yellow-500 font-bold">{student.percentile}th</div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="grid md:grid-cols-4 gap-6 mt-6"
          >
            <div className="glass-card p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-primary-500">150</div>
              <p className="text-gray-400">Total Students</p>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-green-500">76%</div>
              <p className="text-gray-400">Average Score</p>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-yellow-500">#{currentUser.id}</div>
              <p className="text-gray-400">Your Rank</p>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-purple-500">95th</div>
              <p className="text-gray-400">Your Percentile</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;