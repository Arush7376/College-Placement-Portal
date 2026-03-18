import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import AIAvatar from '../components/AIAvatar';
import { interviewAPI } from '../services/api';

const MockInterview = () => {
  const [interviewConfig, setInterviewConfig] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [answers, setAnswers] = useState([]);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviewData = async () => {
      setLoading(true);
      setError(null);
      try {
        const config = JSON.parse(localStorage.getItem('interviewConfig') || '{}');
        setInterviewConfig(config);

        if (config.jobRole && config.interviewType) {
          const response = await interviewAPI.getQuestions({
            job_role: config.jobRole,
            interview_type: config.interviewType,
            count: config.questions
          });

          const data = response.data;

          if (data && data.error) {
            throw new Error(data.error);
          }

          if (!Array.isArray(data)) {
            console.error('Invalid data format received:', data);
            throw new Error('Invalid data format received from server');
          }

          setQuestions(data);
        } else {
          navigate('/mock-interview-setup');
        }
      } catch (err) {
        console.error('Failed to fetch interview questions:', err);
        setError(err.message || 'Failed to load interview questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewData();
  }, [navigate]);

  const currentQ = questions[currentQuestion];

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setAiSpeaking(true);
      utterance.onend = () => setAiSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported');
      simulateAISpeaking();
    }
  };

  const startInterview = () => {
    setInterviewStarted(true);
    if (questions.length > 0) {
      speak(`Hello! Let's begin your ${interviewConfig.interviewType} interview for the ${interviewConfig.jobRole} position. Here is your first question: ${questions[0].question}`);
    }
  };

  const simulateAISpeaking = () => {
    setAiSpeaking(true);
    setTimeout(() => {
      setAiSpeaking(false);
    }, 3000);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please use Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();

    // Stop after 30 seconds of inactivity or when user clicks stop
    setTimeout(() => {
      recognition.stop();
    }, 30000);
  };

  const submitAnswer = () => {
    if (!transcript.trim()) {
      alert('Please provide an answer before submitting');
      return;
    }

    const newAnswer = {
      question_id: currentQ.id,
      question: currentQ.question,
      answer: transcript,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setTranscript('');

    if (currentQuestion < questions.length - 1) {
      const nextIndex = currentQuestion + 1;
      setCurrentQuestion(nextIndex);
      speak(questions[nextIndex].question);
    } else {
      finishInterview(updatedAnswers);
    }
  };

  const finishInterview = async (finalAnswers) => {
    setIsFinishing(true);
    try {
      const response = await interviewAPI.evaluate({
        job_role: interviewConfig.jobRole,
        interview_type: interviewConfig.interviewType,
        answers: finalAnswers || answers
      });

      // Merge evaluation with original data
      const results = {
        ...response.data,
        answers: finalAnswers || answers,
        questions: questions
      };

      localStorage.setItem('interviewResults', JSON.stringify(results));
      navigate('/interview-results');
    } catch (error) {
      console.error('Failed to evaluate interview:', error);
      alert('Verification failed. Storing answers locally.');
      const fallbackResults = {
        score: 0,
        summary: "Evaluation failed due to server error.",
        answers: finalAnswers || answers
      };
      localStorage.setItem('interviewResults', JSON.stringify(fallbackResults));
      navigate('/interview-results');
    } finally {
      setIsFinishing(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 rounded-2xl text-center max-w-2xl border-red-500/50"
        >
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-3xl font-bold mb-4">Interview Setup Error</h1>
          <p className="text-red-400 mb-8">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => window.location.reload()}>
              🔄 Try Again
            </Button>
            <Button variant="secondary" onClick={() => navigate('/mock-interview-setup')}>
              ⚙️ Change Settings
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading || !interviewConfig || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p>Generating questions with Gemini...</p>
        </div>
      </div>
    );
  }

  if (isFinishing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Gemini is evaluating your performance...</p>
        </div>
      </div>
    );
  }

  if (!interviewStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 rounded-2xl text-center max-w-2xl"
        >
          <AIAvatar isActive={true} size="lg" />

          <h1 className="text-3xl font-bold mt-6 mb-4">Ready to Start?</h1>
          <p className="text-gray-400 mb-6">
            Your AI interviewer is ready to begin the {interviewConfig.interviewType} interview
            for {interviewConfig.jobRole} position.
          </p>

          <div className="glass-card p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Interview Details</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Position</p>
                <p>{interviewConfig.jobRole}</p>
              </div>
              <div>
                <p className="text-gray-400">Type</p>
                <p>{interviewConfig.interviewType}</p>
              </div>
              <div>
                <p className="text-gray-400">Questions</p>
                <p>{interviewConfig.questions}</p>
              </div>
            </div>
          </div>

          <Button onClick={startInterview} size="lg">
            🎤 Start Interview
          </Button>
        </motion.div>
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
              <h1 className="text-xl font-bold">{interviewConfig.jobRole} Interview</h1>
              <p className="text-gray-400">{interviewConfig.interviewType} • Question {currentQuestion + 1} of {questions.length}</p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-400">Progress</p>
              <p className="text-lg font-bold">{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</p>
            </div>
          </div>

          <div className="mt-4 bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              className="bg-primary-500 h-2 rounded-full"
            />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* AI Interviewer */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 rounded-xl"
          >
            <div className="text-center mb-6">
              <AIAvatar isActive={aiSpeaking} size="lg" />
              <h2 className="text-xl font-bold mt-4">AI Interviewer</h2>
              <p className="text-gray-400">
                {aiSpeaking ? 'Speaking...' : 'Listening...'}
              </p>
            </div>

            {/* Current Question */}
            <div className="glass-card p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">Current Question:</h3>
              <p className="text-lg">{currentQ?.question}</p>
            </div>

            {/* AI Status */}
            <div className="text-center">
              {aiSpeaking ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  <span className="ml-2 text-primary-500">AI is speaking...</span>
                </div>
              ) : (
                <p className="text-green-500">Ready for your answer</p>
              )}
            </div>
          </motion.div>

          {/* User Response Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 rounded-xl"
          >
            <h3 className="text-xl font-bold mb-4">Your Response</h3>

            {/* Microphone */}
            <div className="text-center mb-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={startListening}
                disabled={isListening || aiSpeaking}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all ${isListening
                  ? 'bg-red-500 animate-pulse'
                  : aiSpeaking
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-primary-500 hover:bg-primary-600'
                  }`}
              >
                🎤
              </motion.button>
              <p className="mt-2 text-sm text-gray-400">
                {isListening ? 'Listening...' : aiSpeaking ? 'Wait for question' : 'Click to speak'}
              </p>
            </div>

            {/* Transcript */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Live Transcript:</label>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="w-full h-32 p-4 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Your answer will appear here... (or type manually)"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                onClick={submitAnswer}
                disabled={!transcript.trim() || aiSpeaking}
                className="flex-1"
              >
                Submit Answer
              </Button>

              {currentQuestion === questions.length - 1 && (
                <Button
                  onClick={finishInterview}
                  variant="success"
                  className="flex-1"
                >
                  Finish Interview
                </Button>
              )}
            </div>

            {/* Voice Status */}
            {isListening && (
              <div className="mt-4 text-center">
                <div className="flex justify-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [10, 30, 10] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      className="w-2 bg-red-500 rounded"
                    />
                  ))}
                </div>
                <p className="text-sm text-red-500">Recording your response...</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Previous Answers */}
        {answers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-xl mt-6"
          >
            <h3 className="text-xl font-bold mb-4">Previous Answers</h3>
            <div className="space-y-4 max-h-60 overflow-y-auto">
              {answers.map((answer, index) => (
                <div key={index} className="bg-white/5 p-4 rounded-lg">
                  <p className="font-medium text-primary-500 mb-2">Q{index + 1}: {answer.question}</p>
                  <p className="text-gray-300">{answer.answer}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MockInterview;