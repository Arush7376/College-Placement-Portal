import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import AIAvatar from '../components/AIAvatar';

const MockInterviewSetup = () => {
  const [interviewConfig, setInterviewConfig] = useState({
    jobRole: '',
    interviewType: '',
    questions: 5
  });
  const navigate = useNavigate();

  const jobRoles = [
    'Frontend Developer',
    'Backend Developer', 
    'Full Stack Developer',
    'Data Analyst',
    'Software Engineer',
    'DevOps Engineer'
  ];

  const interviewTypes = [
    { type: 'HR', description: 'Behavioral and general questions', icon: '👥' },
    { type: 'Technical', description: 'Technical skills and problem solving', icon: '💻' },
    { type: 'Managerial', description: 'Leadership and management scenarios', icon: '👔' }
  ];

  const handleStartInterview = () => {
    if (!interviewConfig.jobRole || !interviewConfig.interviewType) {
      alert('Please select both job role and interview type');
      return;
    }
    
    localStorage.setItem('interviewConfig', JSON.stringify(interviewConfig));
    navigate('/mock-interview');
  };

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <AIAvatar isActive={true} size="lg" />
            <h1 className="text-4xl font-bold mt-6 mb-4">AI Mock Interview</h1>
            <p className="text-xl text-gray-400">
              Practice with our AI interviewer and get real-time feedback
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl">
            {/* Job Role Selection */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Select Job Role</h2>
              <p className="text-gray-400 mb-6">Choose the position you're preparing for</p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobRoles.map((role) => (
                  <motion.button
                    key={role}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setInterviewConfig({ ...interviewConfig, jobRole: role })}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      interviewConfig.jobRole === role
                        ? 'border-primary-500 bg-primary-500/20'
                        : 'border-white/20 hover:border-primary-500/50'
                    }`}
                  >
                    <div className="text-2xl mb-2">💼</div>
                    <h3 className="font-semibold">{role}</h3>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Interview Type Selection */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Interview Type</h2>
              <p className="text-gray-400 mb-6">What type of interview would you like to practice?</p>
              
              <div className="grid md:grid-cols-3 gap-6">
                {interviewTypes.map((interview) => (
                  <motion.button
                    key={interview.type}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setInterviewConfig({ ...interviewConfig, interviewType: interview.type })}
                    className={`p-6 rounded-lg border-2 transition-all text-center ${
                      interviewConfig.interviewType === interview.type
                        ? 'border-primary-500 bg-primary-500/20'
                        : 'border-white/20 hover:border-primary-500/50'
                    }`}
                  >
                    <div className="text-4xl mb-3">{interview.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{interview.type}</h3>
                    <p className="text-sm text-gray-400">{interview.description}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Number of Questions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Number of Questions</h2>
              <p className="text-gray-400 mb-6">How many questions would you like to practice?</p>
              
              <div className="grid grid-cols-3 gap-4">
                {[5, 10, 15].map((num) => (
                  <motion.button
                    key={num}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setInterviewConfig({ ...interviewConfig, questions: num })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      interviewConfig.questions === num
                        ? 'border-primary-500 bg-primary-500/20'
                        : 'border-white/20 hover:border-primary-500/50'
                    }`}
                  >
                    {num} Questions
                    <div className="text-sm text-gray-400 mt-1">
                      ~{num * 2} minutes
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Interview Summary */}
            {interviewConfig.jobRole && interviewConfig.interviewType && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 rounded-lg mb-8"
              >
                <h3 className="text-lg font-semibold mb-4">Interview Summary</h3>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-gray-400">Job Role</p>
                    <p className="font-semibold">{interviewConfig.jobRole}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Type</p>
                    <p className="font-semibold">{interviewConfig.interviewType}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Questions</p>
                    <p className="font-semibold">{interviewConfig.questions}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Start Interview Button */}
            <div className="text-center">
              <Button
                onClick={handleStartInterview}
                size="lg"
                disabled={!interviewConfig.jobRole || !interviewConfig.interviewType}
                className="px-12"
              >
                🎤 Start Interview
              </Button>
              
              <div className="mt-6 text-sm text-gray-400">
                <p>💡 Tips for a great interview:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Find a quiet environment</li>
                  <li>• Speak clearly and confidently</li>
                  <li>• Take your time to think before answering</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MockInterviewSetup;