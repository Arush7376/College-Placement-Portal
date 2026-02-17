import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import mockResults from '../data/mockResults.json';

const AdminDashboard = () => {
  const { adminStats } = mockResults;

  return (
    <div className="flex">
      <Sidebar userRole="admin" />
      
      <div className="flex-1 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard 👨‍💼</h1>
          
          {/* Overview Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Students"
              value={adminStats.totalStudents}
              icon="👥"
              color="blue"
            />
            <StatCard
              title="Average Readiness"
              value={`${adminStats.averageReadiness}%`}
              icon="📊"
              color="green"
            />
            <StatCard
              title="Active Tests"
              value="12"
              icon="📝"
              color="purple"
            />
            <StatCard
              title="Interviews Today"
              value="8"
              icon="🎤"
              color="yellow"
            />
          </div>

          {/* Charts and Analytics */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 rounded-xl"
            >
              <h2 className="text-xl font-bold mb-4">Student Performance Overview</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Excellent (80-100%)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <span className="text-green-500 font-bold">45%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Good (60-79%)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                    <span className="text-blue-500 font-bold">35%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Needs Improvement</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                    <span className="text-red-500 font-bold">20%</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6 rounded-xl"
            >
              <h2 className="text-xl font-bold mb-4">Weak Subjects Analysis</h2>
              <div className="space-y-4">
                {adminStats.weakSubjects.map((subject, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>{subject}</span>
                    </div>
                    <span className="text-red-500 text-sm">High Priority</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 rounded-xl"
          >
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    👤
                  </div>
                  <div>
                    <p className="font-medium">New student registered</p>
                    <p className="text-sm text-gray-400">John Smith joined the platform</p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">2 min ago</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    📝
                  </div>
                  <div>
                    <p className="font-medium">Test completed</p>
                    <p className="text-sm text-gray-400">Jane Doe completed DSA test with 85% score</p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">5 min ago</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    🎤
                  </div>
                  <div>
                    <p className="font-medium">Mock interview finished</p>
                    <p className="text-sm text-gray-400">Alex Johnson completed technical interview</p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">10 min ago</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;