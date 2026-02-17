import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import AIAvatar from '../components/AIAvatar';
import mockQuestions from '../data/mockQuestions.json';

const MockInterview = () => {
  const [interviewConfig, setInterviewConfig] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [answers, setAnswers] = useState([]);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const config = JSON.parse(localStorage.getItem('interviewConfig') || '{}');
    setInterviewConfig(config);
  }, []);

  const getQuestions = () => {
    if (!interviewConfig) return [];
    return mockQuestions.interviewQuestions
      .filter(q => q.type === interviewConfig.interviewType)
      .slice(0, interviewConfig.questions);
  };

  const questions = getQuestions();
  const currentQ = questions[currentQuestion];

  const startInterview = () => {
    setInterviewStarted(true);
    simulateAISpeaking();
  };

  const simulateAISpeaking = () => {
    setAiSpeaking(true);
    setTimeout(() => {
      setAiSpeaking(false);
    }, 3000);
  };

  const startListening = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      const mockResponses = [
        "I am a passionate developer with 3 years of experience in React and Node.js. I love solving complex problems and building user-friendly applications.",
        "I use useState for local component state and useEffect for side effects like API calls. For global state, I prefer Redux or Context API.",
        "I would start by understanding the requirements, break down the problem into smaller tasks, design the architecture, and then implement with proper testing.",
        "My biggest strength is my ability to learn quickly and adapt to new technologies. I'm always eager to take on new challenges.",
        "I handle stress by staying organized, prioritizing tasks, and taking breaks when needed. I also communicate with my team when I need support."
      ];
      
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      setTranscript(randomResponse);
      setIsListening(false);
    }, 3000);
  };

  const submitAnswer = () => {
    if (!transcript.trim()) {
      alert('Please provide an answer before submitting');
      return;
    }

    const newAnswer = {
      question: currentQ.question,
      answer: transcript,
      timestamp: new Date().toISOString()
    };

    setAnswers([...answers, newAnswer]);
    setTranscript('');

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      simulateAISpeaking();
    } else {
      finishInterview();
    }
  };

  const finishInterview = () => {
    const results = {
      interviewConfig,
      answers,
      score: Math.floor(Math.random() * 30) + 70, // Mock score 70-100
      feedback: [
        "Great communication skills",
        "Good technical knowledge",
        "Could improve on specific examples"
      ]
    };
    localStorage.setItem('interviewResults', JSON.stringify(results));
    navigate('/interview-results');
  };

  if (!interviewConfig || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p>Loading interview...</p>
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
                className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all ${
                  isListening 
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