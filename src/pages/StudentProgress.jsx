import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import mockStudents from '../data/mockStudents.json';

const StudentProgress = () => {
  const { students } = mockStudents;

  return (
    <div className="flex">
      <Sidebar userRole="admin" />
      
      <div className="flex-1 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-8">Student Progress 📊</h1>
          
          {/* Overview Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="glass-card p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-blue-500">{students.length}</div>
              <p className="text-gray-400">Total Students</p>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-green-500">
                {Math.round(students.reduce((acc, s) => acc + s.readinessScore, 0) / students.length)}%
              </div>
              <p className="text-gray-400">Avg Readiness</p>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-yellow-500">
                {students.filter(s => s.readinessScore >= 80).length}
              </div>
              <p className="text-gray-400">High Performers</p>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <div className="text-2xl font-bold text-red-500">
                {students.filter(s => s.readinessScore < 60).length}
              </div>
              <p className="text-gray-400">Need Attention</p>
            </div>
          </div>

          {/* Student Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold">All Students</h2>
              <p className="text-gray-400">Detailed progress tracking</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left">Student</th>
                    <th className="px-6 py-4 text-center">Readiness</th>
                    <th className="px-6 py-4 text-center">DSA</th>
                    <th className="px-6 py-4 text-center">Aptitude</th>
                    <th className="px-6 py-4 text-center">Core</th>
                    <th className="px-6 py-4 text-center">Recent Tests</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-gray-400">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className={`text-lg font-bold ${
                          student.readinessScore >= 80 ? 'text-green-500' :
                          student.readinessScore >= 60 ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {student.readinessScore}%
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
                        <div className="text-sm">
                          {student.recentTests.length} tests
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex space-x-2 justify-center">
                          <button className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm transition-colors">
                            View
                          </button>
                          <button className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm transition-colors">
                            Message
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentProgress;