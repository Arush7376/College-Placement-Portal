import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';

const TestResults = () => {
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const testResults = JSON.parse(localStorage.getItem('testResults') || 'null');
    if (!testResults) {
      navigate('/dashboard');
      return;
    }
    setResults(testResults);
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
    if (score >= 80) return 'Excellent! You\'re well prepared! 🎉';
    if (score >= 60) return 'Good job! Keep practicing to improve! 👍';
    return 'Keep practicing! You\'ll get better! 💪';
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 rounded-2xl text-center"
        >
          <div className="text-6xl mb-6">
            {results.score >= 80 ? '🎉' : results.score >= 60 ? '👍' : '💪'}
          </div>

          <h1 className="text-4xl font-bold mb-4">Test Completed!</h1>
          <p className="text-xl text-gray-400 mb-8">{getPerformanceMessage(results.score)}</p>

          {/* Score Display */}
          <div className="glass-card p-6 rounded-xl mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Score</h2>
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(results.score)}`}>
              {results.score}%
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Subject</p>
                <p className="font-bold">{results.testConfig.subject}</p>
              </div>
              <div>
                <p className="text-gray-400">Topic</p>
                <p className="font-bold">{results.testConfig.topic}</p>
              </div>
              <div>
                <p className="text-gray-400">Time Spent</p>
                <p className="font-bold">{Math.floor(results.timeSpent / 60)}m {results.timeSpent % 60}s</p>
              </div>
            </div>
          </div>

          {/* Performance Breakdown */}
          <div className="glass-card p-6 rounded-xl mb-8">
            <h3 className="text-xl font-bold mb-4">Performance Analysis</h3>

            {results.feedback && (
              <div className="mb-6 p-4 bg-gray-800 rounded-lg text-left">
                <h4 className="font-semibold mb-2 text-blue-400">AI Feedback</h4>
                <p className="text-gray-300">{results.feedback}</p>
              </div>
            )}

            {results.analysis && Array.isArray(results.analysis) && results.analysis.length > 0 ? (
              <div className="space-y-4 text-left">
                <h4 className="font-semibold mb-2">Detailed Breakdown</h4>
                {results.analysis.map((item, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${item.status === 'Correct' ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold">Question {item.question_id || index + 1}</span>
                      <span className={item.status === 'Correct' ? 'text-green-400' : 'text-red-400'}>{item.status}</span>
                    </div>
                    <p className="text-sm text-gray-300">{item.feedback}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-green-500">Strengths</h4>
                  <ul className="text-left space-y-1 text-gray-300">
                    <li>• Good understanding of basic concepts</li>
                    <li>• Consistent performance across topics</li>
                    <li>• Efficient time management</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-red-500">Areas to Improve</h4>
                  <ul className="text-left space-y-1 text-gray-300">
                    <li>• Complex problem solving</li>
                    <li>• Advanced algorithms</li>
                    <li>• Edge case handling</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/test-setup">
              <Button size="lg" className="w-full sm:w-auto">
                Take Another Test
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

export default TestResults;