import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import mockQuestions from '../data/mockQuestions.json';

const TestPage = () => {
  const [testConfig, setTestConfig] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const config = JSON.parse(localStorage.getItem('testConfig') || '{}');
    setTestConfig(config);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestions = () => {
    if (!testConfig) return [];
    
    if (testConfig.type === 'Coding') {
      return mockQuestions.codingQuestions.slice(0, testConfig.questions);
    } else {
      const questionPool = testConfig.subject === 'DSA' 
        ? mockQuestions.dsaQuestions 
        : mockQuestions.aptitudeQuestions;
      return questionPool.slice(0, testConfig.questions);
    }
  };

  const questions = getQuestions();
  const currentQ = questions[currentQuestion];

  const handleAnswerSelect = (answerIndex) => {
    setAnswers({
      ...answers,
      [currentQuestion]: answerIndex
    });
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    setAnswers({
      ...answers,
      [currentQuestion]: e.target.value
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCode(answers[currentQuestion + 1] || '');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setCode(answers[currentQuestion - 1] || '');
    }
  };

  const handleSubmitTest = () => {
    const results = {
      testConfig,
      answers,
      timeSpent: 1800 - timeLeft,
      score: Math.floor(Math.random() * 40) + 60 // Mock score
    };
    localStorage.setItem('testResults', JSON.stringify(results));
    navigate('/test-results');
  };

  if (!testConfig || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p>Loading test...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 rounded-xl mb-6"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">{testConfig.subject} - {testConfig.topic}</h1>
              <p className="text-gray-400">{testConfig.type} Test • {testConfig.difficulty}</p>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-sm text-gray-400">Time Left</p>
                <p className="text-2xl font-bold text-red-500">{formatTime(timeLeft)}</p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-400">Progress</p>
                <p className="text-lg font-bold">{currentQuestion + 1} / {questions.length}</p>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              className="bg-primary-500 h-2 rounded-full"
            />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-3">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6 rounded-xl"
            >
              {testConfig.type === 'Coding' ? (
                <div>
                  <h2 className="text-2xl font-bold mb-4">{currentQ.title}</h2>
                  <div className="mb-6">
                    <p className="text-gray-300 mb-4">{currentQ.description}</p>
                    
                    {currentQ.examples && (
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Example:</h4>
                        {currentQ.examples.map((example, idx) => (
                          <div key={idx} className="mb-2">
                            <p><span className="text-green-400">Input:</span> {example.input}</p>
                            <p><span className="text-blue-400">Output:</span> {example.output}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Solution:</label>
                    <textarea
                      value={code}
                      onChange={handleCodeChange}
                      className="w-full h-64 p-4 bg-gray-800 border border-gray-600 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Write your code here..."
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold mb-6">
                    Question {currentQuestion + 1}
                  </h2>
                  
                  <p className="text-lg mb-6">{currentQ.question}</p>
                  
                  <div className="space-y-3">
                    {currentQ.options.map((option, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                          answers[currentQuestion] === index
                            ? 'border-primary-500 bg-primary-500/20'
                            : 'border-gray-600 hover:border-primary-500/50'
                        }`}
                      >
                        <span className="font-medium mr-3">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        {option}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <div className="glass-card p-4 rounded-xl mb-6">
              <h3 className="font-semibold mb-4">Questions</h3>
              <div className="grid grid-cols-5 lg:grid-cols-3 gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentQuestion(index);
                      setCode(answers[index] || '');
                    }}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                      index === currentQuestion
                        ? 'bg-primary-500 text-white'
                        : answers[index] !== undefined
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl">
              <h3 className="font-semibold mb-4">Legend</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-primary-500 rounded"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-600 rounded"></div>
                  <span>Not Answered</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between mt-6"
        >
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          
          <div className="space-x-4">
            {currentQuestion === questions.length - 1 ? (
              <Button onClick={handleSubmitTest} variant="success">
                Submit Test
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TestPage;