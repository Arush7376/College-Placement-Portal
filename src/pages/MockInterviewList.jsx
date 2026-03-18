import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from '../components/Sidebar';
import { interviewAPI } from '../services/api';

const MockInterviewList = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isDark, cardBg, text, textSecondary } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                setLoading(true);
                const response = await interviewAPI.getPastInterviews();
                setInterviews(response.data);
            } catch (err) {
                console.error('Failed to fetch past interviews:', err);
                setError('Failed to load interview history. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchInterviews();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleViewResult = (interview) => {
        localStorage.setItem('interviewResults', JSON.stringify(interview));
        navigate('/interview-results');
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
            <Sidebar />

            <div className="flex-1 p-4 sm:p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h1 className={`text-2xl sm:text-3xl font-bold ${text}`}>Mock Interview History</h1>
                        <button
                            onClick={() => navigate('/mock-interview-setup')}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <span>+</span> New Interview
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                        </div>
                    ) : error ? (
                        <div className={`p-8 text-center rounded-xl bg-red-500/10 border border-red-500/20`}>
                            <p className="text-red-400 mb-4">{error}</p>
                            <button onClick={() => window.location.reload()} className="text-primary-500 hover:underline">Retry</button>
                        </div>
                    ) : interviews.length === 0 ? (
                        <div className={`p-20 text-center rounded-2xl ${cardBg} backdrop-blur-lg border ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                            <div className="text-6xl mb-6">🎤</div>
                            <h2 className={`text-xl font-semibold mb-2 ${text}`}>No Interviews Yet</h2>
                            <p className={`${textSecondary} mb-8`}>Practice your interview skills with our AI interviewer.</p>
                            <button
                                onClick={() => navigate('/mock-interview-setup')}
                                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl transition-all font-medium"
                            >
                                Start Your First Interview
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {interviews.map((interview, index) => (
                                <motion.div
                                    key={interview.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`${cardBg} p-6 rounded-2xl border ${isDark ? 'border-white/10' : 'border-gray-200'} hover:border-primary-500/50 transition-all cursor-pointer group shadow-lg hover:shadow-primary-500/10`}
                                    onClick={() => handleViewResult(interview)}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 rounded-xl bg-primary-500/10 text-primary-500 text-2xl">
                                            🎤
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-primary-500">{interview.score}%</div>
                                            <div className={`text-xs ${textSecondary}`}>Score</div>
                                        </div>
                                    </div>

                                    <h3 className={`text-lg font-bold mb-1 ${text}`}>{interview.job_role}</h3>
                                    <p className={`text-sm mb-4 ${textSecondary}`}>{interview.interview_type} Interview</p>

                                    <div className="flex items-center text-xs text-gray-500 mb-6">
                                        <span className="mr-4">📅 {formatDate(interview.created_at)}</span>
                                    </div>

                                    <div className={`text-sm line-clamp-2 mb-6 ${textSecondary} italic`}>
                                        "{interview.summary}"
                                    </div>

                                    <button
                                        className="w-full py-2 bg-primary-500/10 text-primary-500 rounded-lg hover:bg-primary-500 hover:text-white transition-all font-medium"
                                    >
                                        View Details
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default MockInterviewList;
