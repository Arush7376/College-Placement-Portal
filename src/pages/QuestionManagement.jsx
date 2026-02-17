import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import mockQuestions from '../data/mockQuestions.json';

const QuestionManagement = () => {
  const [activeTab, setActiveTab] = useState('dsa');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    difficulty: 'Easy'
  });

  const tabs = [
    { id: 'dsa', label: 'DSA', questions: mockQuestions.dsaQuestions },
    { id: 'aptitude', label: 'Aptitude', questions: mockQuestions.aptitudeQuestions },
    { id: 'coding', label: 'Coding', questions: mockQuestions.codingQuestions }
  ];

  const currentQuestions = tabs.find(tab => tab.id === activeTab)?.questions || [];

  const handleAddQuestion = () => {
    // Mock add functionality
    console.log('Adding question:', newQuestion);
    setShowAddForm(false);
    setNewQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      difficulty: 'Easy'
    });
  };

  return (
    <div className="flex">
      <Sidebar userRole="admin" />
      
      <div className="flex-1 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Question Management ❓</h1>
            <Button onClick={() => setShowAddForm(true)}>
              ➕ Add Question
            </Button>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {tab.label} ({tab.questions.length})
              </button>
            ))}
          </div>

          {/* Questions List */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold">{tabs.find(t => t.id === activeTab)?.label} Questions</h2>
            </div>
            
            <div className="divide-y divide-white/5">
              {currentQuestions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 hover:bg-white/5 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">
                        {activeTab === 'coding' ? question.title : `Q${index + 1}: ${question.question}`}
                      </h3>
                      
                      {activeTab === 'coding' ? (
                        <p className="text-gray-400 mb-2">{question.description}</p>
                      ) : (
                        <div className="space-y-1 mb-2">
                          {question.options?.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`text-sm ${
                                optIndex === question.correctAnswer ? 'text-green-500 font-medium' : 'text-gray-400'
                              }`}
                            >
                              {String.fromCharCode(65 + optIndex)}. {option}
                              {optIndex === question.correctAnswer && ' ✓'}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={`px-2 py-1 rounded ${
                          question.difficulty === 'Easy' ? 'bg-green-500/20 text-green-500' :
                          question.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-red-500/20 text-red-500'
                        }`}>
                          {question.difficulty}
                        </span>
                        <span className="text-gray-400">ID: {question.id}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm transition-colors">
                        Edit
                      </button>
                      <button className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Add Question Modal */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="glass-card p-6 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <h2 className="text-2xl font-bold mb-6">Add New Question</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Question</label>
                    <textarea
                      value={newQuestion.question}
                      onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows="3"
                      placeholder="Enter your question..."
                    />
                  </div>
                  
                  {activeTab !== 'coding' && (
                    <>
                      {newQuestion.options.map((option, index) => (
                        <div key={index}>
                          <label className="block text-sm font-medium mb-2">Option {String.fromCharCode(65 + index)}</label>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...newQuestion.options];
                              newOptions[index] = e.target.value;
                              setNewQuestion({...newQuestion, options: newOptions});
                            }}
                            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder={`Enter option ${String.fromCharCode(65 + index)}...`}
                          />
                        </div>
                      ))}
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Correct Answer</label>
                        <select
                          value={newQuestion.correctAnswer}
                          onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: parseInt(e.target.value)})}
                          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          {newQuestion.options.map((_, index) => (
                            <option key={index} value={index}>
                              Option {String.fromCharCode(65 + index)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Difficulty</label>
                    <select
                      value={newQuestion.difficulty}
                      onChange={(e) => setNewQuestion({...newQuestion, difficulty: e.target.value})}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex space-x-4 mt-6">
                  <Button onClick={handleAddQuestion} className="flex-1">
                    Add Question
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => setShowAddForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default QuestionManagement;