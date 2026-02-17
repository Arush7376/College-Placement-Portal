import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import mockResults from '../data/mockResults.json';

const StudyPlan = () => {
  const { studyPlan } = mockResults.performanceData;

  const TaskCard = ({ task, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-4 rounded-lg border-2 transition-all ${
        task.completed 
          ? 'border-green-500 bg-green-500/10' 
          : 'border-gray-600 hover:border-primary-500'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
            task.completed ? 'bg-green-500' : 'bg-gray-600'
          }`}>
            {task.completed ? '✓' : '○'}
          </div>
          <div>
            <p className="font-medium">{task.day}</p>
            <p className="text-sm text-gray-400">{task.topic}</p>
          </div>
        </div>
        {!task.completed && (
          <Button size="sm">Mark Complete</Button>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-8">AI Study Plan 📚</h1>
          
          {/* Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-card p-6 rounded-xl text-center"
            >
              <div className="text-4xl mb-2">🎯</div>
              <h3 className="text-xl font-bold">Current Goal</h3>
              <p className="text-gray-400">Improve DSA Skills</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-card p-6 rounded-xl text-center"
            >
              <div className="text-4xl mb-2">📅</div>
              <h3 className="text-xl font-bold">Study Streak</h3>
              <p className="text-2xl font-bold text-green-500">7 days</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-card p-6 rounded-xl text-center"
            >
              <div className="text-4xl mb-2">⏱️</div>
              <h3 className="text-xl font-bold">Daily Target</h3>
              <p className="text-2xl font-bold text-blue-500">2 hours</p>
            </motion.div>
          </div>

          {/* Weekly Plan */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Week 1 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6 rounded-xl"
            >
              <h2 className="text-xl font-bold mb-4">Week 1 - Fundamentals</h2>
              <div className="space-y-3">
                {studyPlan.week1.map((task, index) => (
                  <TaskCard key={index} task={task} index={index} />
                ))}
              </div>
              
              <div className="mt-4 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(studyPlan.week1.filter(t => t.completed).length / studyPlan.week1.length) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {studyPlan.week1.filter(t => t.completed).length} of {studyPlan.week1.length} completed
              </p>
            </motion.div>

            {/* Week 2 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6 rounded-xl"
            >
              <h2 className="text-xl font-bold mb-4">Week 2 - Advanced Topics</h2>
              <div className="space-y-3">
                {studyPlan.week2.map((task, index) => (
                  <TaskCard key={index} task={task} index={index} />
                ))}
              </div>
              
              <div className="mt-4 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(studyPlan.week2.filter(t => t.completed).length / studyPlan.week2.length) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {studyPlan.week2.filter(t => t.completed).length} of {studyPlan.week2.length} completed
              </p>
            </motion.div>
          </div>

          {/* Recommended Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 rounded-xl mt-6"
          >
            <h2 className="text-xl font-bold mb-4">Recommended Resources</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <h3 className="font-semibold mb-2">📖 Reading</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Cracking the Coding Interview</li>
                  <li>• Elements of Programming Interviews</li>
                  <li>• System Design Interview</li>
                </ul>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg">
                <h3 className="font-semibold mb-2">💻 Practice</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• LeetCode Daily Challenge</li>
                  <li>• HackerRank Problem Solving</li>
                  <li>• GeeksforGeeks Practice</li>
                </ul>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg">
                <h3 className="font-semibold mb-2">🎥 Videos</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Abdul Bari Algorithms</li>
                  <li>• MIT OpenCourseWare</li>
                  <li>• Tech Interview Prep</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 mt-6"
          >
            <Button className="flex-1">
              🔄 Regenerate Plan
            </Button>
            <Button variant="secondary" className="flex-1">
              📊 View Progress
            </Button>
            <Button variant="success" className="flex-1">
              🎯 Set New Goal
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudyPlan;