import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';

const InterviewResults = () => {
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const interviewResults = JSON.parse(localStorage.getItem('interviewResults') || 'null');
    if (!interviewResults) {
      navigate('/dashboard');
      return;
    }
    setResults(interviewResults);
  }, [navigate]);

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getPerformanceMessage = (score) => {
    if (score >= 80) return 'Outstanding interview performance! 🌟';
    if (score >= 60) return 'Good interview! Room for improvement! 👍';
    return 'Keep practicing! You\'ll nail it next time! 💪';
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 rounded-2xl text-center"
        >
          <div className="text-6xl mb-6">🎤</div>
          
          <h1 className="text-4xl font-bold mb-4">Interview Completed!</h1>
          <p className="text-xl text-gray-400 mb-8">{getPerformanceMessage(results.score)}</p>
          
          {/* Score Display */}
          <div className="glass-card p-6 rounded-xl mb-8">
            <h2 className="text-2xl font-bold mb-4">Interview Score</h2>
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(results.score)}`}>
              {results.score}%
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Position</p>
                <p className="font-bold">{results.interviewConfig.jobRole}</p>
              </div>
              <div>
                <p className="text-gray-400">Interview Type</p>
                <p className="font-bold">{results.interviewConfig.interviewType}</p>
              </div>
              <div>
                <p className="text-gray-400">Questions</p>
                <p className="font-bold">{results.interviewConfig.questions}</p>
              </div>
            </div>
          </div>

          {/* Detailed Scores */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-card p-4 rounded-xl"
            >
              <h3 className="font-semibold mb-2">Communication</h3>
              <div className="text-2xl font-bold text-blue-500">85%</div>
              <p className="text-sm text-gray-400">Clear and articulate</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-card p-4 rounded-xl"
            >
              <h3 className="font-semibold mb-2">Technical Depth</h3>
              <div className="text-2xl font-bold text-green-500">78%</div>
              <p className="text-sm text-gray-400">Good technical knowledge</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="glass-card p-4 rounded-xl"
            >
              <h3 className="font-semibold mb-2">Confidence</h3>
              <div className="text-2xl font-bold text-purple-500">82%</div>
              <p className="text-sm text-gray-400">Confident responses</p>
            </motion.div>
          </div>

          {/* AI Feedback */}
          <div className="glass-card p-6 rounded-xl mb-8 text-left">
            <h3 className="text-xl font-bold mb-4">AI Feedback</h3>
            <div className="space-y-3">
              {results.feedback.map((feedback, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                  <p className="text-gray-300">{feedback}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Your Responses */}
          <div className="glass-card p-6 rounded-xl mb-8 text-left">
            <h3 className="text-xl font-bold mb-4">Your Responses</h3>
            <div className="space-y-4 max-h-60 overflow-y-auto">
              {results.answers.map((answer, index) => (
                <div key={index} className="bg-white/5 p-4 rounded-lg">
                  <p className="font-medium text-primary-500 mb-2">Q{index + 1}: {answer.question}</p>
                  <p className="text-gray-300 text-sm">{answer.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/mock-interview-setup">
              <Button size="lg" className="w-full sm:w-auto">
                Practice Again
              </Button>
            </Link>
            <Link to="/analytics">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                View Analytics
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InterviewResults;