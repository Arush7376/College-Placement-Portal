import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import mockQuestions from '../data/mockQuestions.json';
import { authAPI, aiAPI } from '../services/api';

const TestPage = () => {
  const [testConfig, setTestConfig] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [code, setCode] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const config = JSON.parse(localStorage.getItem('testConfig') || '{}');
    setTestConfig(config);

    const fetchQuestions = async () => {
      setLoading(true);
      setErrorDetails('');
      try {
        if (config.subject) {
          const response = await aiAPI.generateQuestions({
            subject: config.subject,
            topic: config.topic,
            difficulty: config.difficulty,
            count: config.questions,
            type: config.type
          });

          let parsedQuestions = [];
          try {
            const rawQuestions = response?.data?.questions;
            if (typeof rawQuestions === 'string') {
              parsedQuestions = JSON.parse(rawQuestions);
            } else if (Array.isArray(rawQuestions)) {
              parsedQuestions = rawQuestions;
            } else if (typeof rawQuestions === 'object') {
              parsedQuestions = [];
              console.error("Received object but expected array/string:", rawQuestions);
              setErrorDetails("Received invalid format from AI (Object).");
            }
          } catch (e) {
            console.error("Failed to parse Gemini response", response?.data?.questions);
            const raw = response?.data?.questions || "Empty response";
            setErrorDetails(`Parse Error: ${e.message}.`);
            parsedQuestions = [];
          }

          if (!Array.isArray(parsedQuestions)) {
            if (!errorDetails) setErrorDetails("Format Error: Response is not an array.");
            parsedQuestions = [];
          }

          setQuestions(parsedQuestions);
          if (parsedQuestions.length > 0 && config.type === 'Coding') {
            setCode(parsedQuestions[0].boilerplate || '');
          }
        }
      } catch (error) {
        console.error("Failed to generate questions", error);
        setErrorDetails(error.message || "Network/API Error");
      } finally {
        setLoading(false);
      }
    };

    if (config.subject) {
      fetchQuestions();
    } else {
      setLoading(false);
      setErrorDetails("Missing Test Configuration");
    }
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

  const currentQ = questions[currentQuestion];

  const handleAnswerSelect = (answerIndex) => {
    setAnswers({
      ...answers,
      [currentQuestion]: answerIndex
    });
  };

  const [isRunningCode, setIsRunningCode] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState(null);

  const handleRunCode = async () => {
    if (!code.trim()) return;
    setIsRunningCode(true);
    setConsoleOutput(null);
    try {
      const response = await aiAPI.runCode({
        code: code,
        problem_description: currentQ.description,
        test_cases: currentQ.test_cases || []
      });

      // Add a small delay for "Realism" in simulation
      setTimeout(() => {
        setConsoleOutput(response.data);
        setIsRunningCode(false);
      }, 1000);
    } catch (error) {
      console.error("Code execution failed", error);
      setConsoleOutput({ status: 'error', output: 'Runtime Error: Failed to connect to execution environment.' });
      setIsRunningCode(false);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      const nextCode = answers[currentQuestion + 1] || questions[currentQuestion + 1].boilerplate || '';
      setCurrentQuestion(currentQuestion + 1);
      setCode(nextCode);
      setConsoleOutput(null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      const prevCode = answers[currentQuestion - 1] || questions[currentQuestion - 1].boilerplate || '';
      setCurrentQuestion(currentQuestion - 1);
      setCode(prevCode);
      setConsoleOutput(null);
    }
  };

  const handleSubmitTest = async () => {
    setLoading(true); // Reuse loading state or add a submitting state
    try {
      // 1. Evaluate with AI
      const evalResponse = await aiAPI.evaluateTest({
        testConfig,
        userAnswers: answers,
        questions: questions
      });

      let evaluation = {};
      try {
        const rawEvaluation = evalResponse?.data?.evaluation;
        if (typeof rawEvaluation === 'string') {
          evaluation = JSON.parse(rawEvaluation);
        } else if (typeof rawEvaluation === 'object' && rawEvaluation !== null) {
          evaluation = rawEvaluation;
        }
      } catch (e) {
        console.error("Failed to parsing evaluation", e);
        evaluation = { score: 0, feedback: "Error parsing result", detailed_analysis: [] };
      }

      const score = evaluation.score || 0;

      // 2. Update Progress (Backend)
      // Get current progress first
      const currentProgressRes = await authAPI.getStudentProgress();
      const current = currentProgressRes.data || {}; // Added default empty object

      const updates = {};
      // Simple progress logic: if score > 60, increase level/progress
      const progressIncrement = score > 60 ? 10 : 2;

      if (testConfig.subject === 'DSA') {
        updates.dsa_progress = Math.min((current.dsa_progress || 0) + progressIncrement, 100);
      } else if (testConfig.subject === 'Aptitude') {
        updates.aptitude_progress = Math.min((current.aptitude_progress || 0) + progressIncrement, 100);
      } else {
        updates.core_subjects_progress = Math.min((current.core_subjects_progress || 0) + progressIncrement, 100);
      }

      updates.project_progress = current.project_progress || 0; // Keep project same

      // Also update readiness
      const newAverage = ((updates.dsa_progress || 0) + (updates.aptitude_progress || 0) + (updates.core_subjects_progress || 0) + (updates.project_progress || 0)) / 4;
      updates.readiness_score = Math.round(newAverage);

      await authAPI.updateStudentProgress(updates);

      // 3. Save Results locally for Results Page
      const results = {
        testConfig,
        answers,
        questions, // Pass questions too so we can show them
        timeSpent: 1800 - timeLeft,
        score: score,
        feedback: evaluation.feedback,
        analysis: evaluation.detailed_analysis
      };
      localStorage.setItem('testResults', JSON.stringify(results));
      navigate('/test-results');

    } catch (error) {
      console.error("Test submission failed", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Generating AI Test...</p>
          <p className="text-gray-400 mt-2">Crafting unique questions for you...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0 || errorDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center max-w-lg p-6">
          <p className="text-xl mb-4">{errorDetails ? "Error Generating Questions" : "Failed to load questions."}</p>
          {errorDetails && (
            <div className="bg-red-900/50 p-4 rounded text-sm font-mono text-left mb-4 overflow-auto max-h-60 border border-red-500">
              {errorDetails}
            </div>
          )}
          <Button onClick={() => navigate('/test-setup')} className="mt-4">Go Back</Button>
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

                  <div className="flex space-x-4 mb-4">
                    <Button
                      onClick={handleRunCode}
                      disabled={isRunningCode || !code.trim()}
                      variant="secondary"
                      className="flex-1"
                    >
                      {isRunningCode ? 'Running...' : '▶ Run Code'}
                    </Button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Your Solution:</label>
                    <textarea
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value);
                        setAnswers({ ...answers, [currentQuestion]: e.target.value });
                      }}
                      className="w-full h-64 p-4 bg-gray-800 border border-gray-600 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Write your code here..."
                    />
                  </div>

                  {consoleOutput && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 font-mono text-sm overflow-hidden rounded-lg border border-gray-700 bg-[#1e1e1e] shadow-2xl"
                    >
                      {/* Terminal Header */}
                      <div className="bg-[#2d2d2d] px-4 py-2 flex justify-between items-center border-b border-gray-700">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-gray-400 px-2 py-0.5 bg-black/30 rounded">
                            {consoleOutput.detected_language || 'Detected'}
                          </span>
                          <span className={consoleOutput.status === 'success' ? 'text-green-500' : 'text-red-500'}>
                            {consoleOutput.status === 'success' ? '✔ Success' : '✖ Error'}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 bg-[#1e1e1e]">
                        <p className="text-gray-500 mb-2 font-bold opacity-50">Output:</p>
                        <pre className={`whitespace-pre-wrap ${consoleOutput.status === 'error' ? 'text-red-400' : 'text-blue-300'}`}>
                          {consoleOutput.output}
                        </pre>

                        {consoleOutput.results && (
                          <div className="mt-6 pt-4 border-t border-gray-800">
                            <p className="text-gray-500 mb-3 font-bold opacity-50">Test Verification:</p>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                              {consoleOutput.results.map((res, i) => (
                                <div
                                  key={i}
                                  className={`p-3 rounded-md flex flex-col items-center justify-center border ${res.passed
                                    ? 'bg-green-500/5 border-green-500/20 text-green-400'
                                    : 'bg-red-500/5 border-red-500/20 text-red-400'
                                    }`}
                                >
                                  <span className="text-[10px] uppercase tracking-wider mb-1 opacity-60">Case {i + 1}</span>
                                  <span className="font-bold text-xs">{res.passed ? 'PASSED' : 'FAILED'}</span>
                                  {res.actual_output && (
                                    <span className="text-[10px] mt-1 opacity-50 truncate w-full text-center">
                                      {res.actual_output}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold mb-6">
                    Question {currentQuestion + 1}
                  </h2>

                  <p className="text-lg mb-6">{currentQ.question}</p>

                  <div className="space-y-3">
                    {currentQ.options.map((option, index) => {
                      const isSelected = answers[currentQuestion] === index;
                      const isCorrect = currentQ.correct_answer === index;
                      const hasAnswered = answers[currentQuestion] !== undefined;

                      let variantClass = 'border-gray-600 hover:border-primary-500/50';
                      if (hasAnswered) {
                        if (isCorrect) {
                          variantClass = 'border-green-500 bg-green-500/20 text-green-400';
                        } else if (isSelected) {
                          variantClass = 'border-red-500 bg-red-500/20 text-red-400';
                        } else {
                          variantClass = 'border-gray-700 opacity-50';
                        }
                      } else if (isSelected) {
                        variantClass = 'border-primary-500 bg-primary-500/20';
                      }

                      return (
                        <motion.button
                          key={index}
                          whileHover={!hasAnswered ? { scale: 1.02 } : {}}
                          onClick={() => !hasAnswered && handleAnswerSelect(index)}
                          disabled={hasAnswered}
                          className={`w-full p-4 text-left rounded-lg border-2 transition-all cursor-pointer ${variantClass}`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium mr-3">
                                {String.fromCharCode(65 + index)}.
                              </span>
                              {option}
                            </div>
                            {hasAnswered && isCorrect && (
                              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            {hasAnswered && isSelected && !isCorrect && (
                              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {answers[currentQuestion] !== undefined && currentQ.explanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg"
                    >
                      <h4 className="text-blue-400 font-semibold mb-2">Explanation:</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {currentQ.explanation}
                      </p>
                    </motion.div>
                  )}
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
                      const navCode = answers[index] || questions[index].boilerplate || '';
                      setCurrentQuestion(index);
                      setCode(navCode);
                      setConsoleOutput(null);
                    }}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${index === currentQuestion
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