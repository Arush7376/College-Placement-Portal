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
          </div>

          {/* Performance Summary */}
          {results.summary && (
            <div className="glass-card p-6 rounded-xl mb-8 text-left">
              <h3 className="text-xl font-bold mb-4">AI Analysis Summary</h3>
              <p className="text-gray-300 leading-relaxed">{results.summary}</p>
            </div>
          )}

          {/* Strengths & Improvements */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="glass-card p-6 rounded-xl text-left border-l-4 border-green-500">
              <h3 className="text-lg font-bold mb-4 text-green-500 flex items-center">
                <span className="mr-2">✅</span> Key Strengths
              </h3>
              <ul className="space-y-2">
                {(results.strengths || []).map((strength, i) => (
                  <li key={i} className="text-gray-300 text-sm flex items-start">
                    <span className="mr-2">•</span> {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-6 rounded-xl text-left border-l-4 border-yellow-500">
              <h3 className="text-lg font-bold mb-4 text-yellow-500 flex items-center">
                <span className="mr-2">📈</span> Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {(results.improvements || []).map((improvement, i) => (
                  <li key={i} className="text-gray-300 text-sm flex items-start">
                    <span className="mr-2">•</span> {improvement}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Feedback Points */}
          <div className="glass-card p-6 rounded-xl mb-8 text-left">
            <h3 className="text-xl font-bold mb-4">Specific Feedback</h3>
            <div className="space-y-3">
              {(results.feedback || []).map((feedback, index) => (
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
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {(results.answers || []).map((answer, index) => (
                <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <p className="font-medium text-primary-500 mb-2">Q{index + 1}: {answer.question}</p>
                  <p className="text-gray-300 text-sm italic">"{answer.answer}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/mock-interview-setup">
              <Button size="lg" className="px-8">
                Practice Again
              </Button>
            </Link>
            <Link to="/analytics">
              <Button variant="secondary" size="lg" className="px-8">
                View Analytics
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" size="lg" className="px-8">
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