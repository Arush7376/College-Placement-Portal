import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import AIAvatar from '../components/AIAvatar';

const AITestSetup = () => {
  const [step, setStep] = useState(1);
  const [testConfig, setTestConfig] = useState({
    subject: '',
    topic: '',
    type: '',
    difficulty: '',
    questions: 10
  });
  const navigate = useNavigate();

  const subjects = {
    'DSA': ['Arrays', 'Strings', 'Trees', 'Graphs', 'Dynamic Programming'],
    'Aptitude': ['Quantitative', 'Logical Reasoning', 'Verbal Ability'],
    'DBMS': ['SQL Queries', 'Normalization', 'Transactions', 'Indexing'],
    'OS': ['Process Management', 'Memory Management', 'File Systems'],
    'CN': ['TCP/IP', 'OSI Model', 'Routing', 'Network Security']
  };

  const companies = ['Amazon', 'Google', 'Microsoft', 'TCS', 'Infosys', 'Wipro'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const testTypes = ['MCQ', 'Coding'];

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleStartTest = () => {
    localStorage.setItem('testConfig', JSON.stringify(testConfig));
    navigate('/test');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center">
            <AIAvatar isActive={true} size="md" />
            <h2 className="text-2xl font-bold mt-6 mb-4">Select Subject</h2>
            <p className="text-gray-400 mb-8">Which subject would you like to practice?</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.keys(subjects).map((subject) => (
                <motion.button
                  key={subject}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTestConfig({ ...testConfig, subject })}
                  className={`p-4 rounded-lg border-2 transition-all ${testConfig.subject === subject
                      ? 'border-primary-500 bg-primary-500/20'
                      : 'border-white/20 hover:border-primary-500/50'
                    }`}
                >
                  {subject}
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Select Topic</h2>
            <p className="text-gray-400 mb-8">Choose a specific topic in {testConfig.subject}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects[testConfig.subject]?.map((topic) => (
                <motion.button
                  key={topic}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setTestConfig({ ...testConfig, topic })}
                  className={`p-4 rounded-lg border-2 transition-all ${testConfig.topic === topic
                      ? 'border-primary-500 bg-primary-500/20'
                      : 'border-white/20 hover:border-primary-500/50'
                    }`}
                >
                  {topic}
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 3:
        const isCodingAllowed = ['DSA', 'DBMS'].includes(testConfig.subject);
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Test Type</h2>
            <p className="text-gray-400 mb-8">How would you like to practice?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testTypes.map((type) => {
                const isDisabled = type === 'Coding' && !isCodingAllowed;
                return (
                  <motion.button
                    key={type}
                    whileHover={!isDisabled ? { scale: 1.05 } : {}}
                    onClick={() => !isDisabled && setTestConfig({ ...testConfig, type })}
                    className={`p-6 rounded-lg border-2 transition-all ${testConfig.type === type
                        ? 'border-primary-500 bg-primary-500/20'
                        : isDisabled
                          ? 'border-gray-800 bg-gray-900/50 opacity-50 cursor-not-allowed'
                          : 'border-white/20 hover:border-primary-500/50'
                      }`}
                  >
                    <div className="text-3xl mb-2">{type === 'MCQ' ? '📝' : '💻'}</div>
                    <h3 className="text-lg font-semibold">{type}</h3>
                    <p className="text-sm text-gray-400 mt-2">
                      {type === 'MCQ' ? 'Multiple choice questions' : isCodingAllowed ? 'Coding problems' : 'Coding available for DSA/DBMS only'}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Difficulty Level</h2>
            <p className="text-gray-400 mb-8">Choose your preferred difficulty</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {difficulties.map((difficulty) => (
                <motion.button
                  key={difficulty}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setTestConfig({ ...testConfig, difficulty })}
                  className={`p-4 rounded-lg border-2 transition-all ${testConfig.difficulty === difficulty
                      ? 'border-primary-500 bg-primary-500/20'
                      : 'border-white/20 hover:border-primary-500/50'
                    }`}
                >
                  <div className="text-2xl mb-2">
                    {difficulty === 'Easy' ? '🟢' : difficulty === 'Medium' ? '🟡' : '🔴'}
                  </div>
                  {difficulty}
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Number of Questions</h2>
            <p className="text-gray-400 mb-8">How many questions would you like?</p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[5, 10, 20].map((num) => (
                <motion.button
                  key={num}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setTestConfig({ ...testConfig, questions: num })}
                  className={`p-4 rounded-lg border-2 transition-all ${testConfig.questions === num
                      ? 'border-primary-500 bg-primary-500/20'
                      : 'border-white/20 hover:border-primary-500/50'
                    }`}
                >
                  {num} Questions
                </motion.button>
              ))}
            </div>

            <div className="glass-card p-6 rounded-lg mb-8">
              <h3 className="text-lg font-semibold mb-4">Test Summary</h3>
              <div className="text-left space-y-2">
                <p><span className="text-gray-400">Subject:</span> {testConfig.subject}</p>
                <p><span className="text-gray-400">Topic:</span> {testConfig.topic}</p>
                <p><span className="text-gray-400">Type:</span> {testConfig.type}</p>
                <p><span className="text-gray-400">Difficulty:</span> {testConfig.difficulty}</p>
                <p><span className="text-gray-400">Questions:</span> {testConfig.questions}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
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
          <div className="glass-card p-8 rounded-2xl">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Step {step} of 5</span>
                <span>{Math.round((step / 5) * 100)}% Complete</span>
              </div>
              <div className="bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / 5) * 100}%` }}
                  className="bg-primary-500 h-2 rounded-full"
                />
              </div>
            </div>

            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="secondary"
                onClick={handleBack}
                disabled={step === 1}
              >
                Back
              </Button>

              {step === 5 ? (
                <Button
                  onClick={handleStartTest}
                  disabled={!testConfig.subject || !testConfig.topic || !testConfig.type || !testConfig.difficulty}
                >
                  Start Test 🚀
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !testConfig.subject) ||
                    (step === 2 && !testConfig.topic) ||
                    (step === 3 && !testConfig.type) ||
                    (step === 4 && !testConfig.difficulty)
                  }
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AITestSetup;