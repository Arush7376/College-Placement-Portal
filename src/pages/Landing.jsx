import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import AIAvatar from '../components/AIAvatar';
import Button from '../components/Button';
import GradientText from '../components/GradientText';

const Landing = () => {
  const { 
    isDark, 
    cardBg, 
    text, 
    textSecondary, 
    hover, 
    gradientText, 
    gradientTextSecondary,
    floatingCard,
    hover3D,
    glow
  } = useTheme();

  const features = [
    {
      icon: '🧠',
      title: 'AI Smart Tests',
      description: 'Adaptive testing with personalized difficulty levels',
      gradient: 'from-blue-400 to-purple-600',
      delay: 0.1
    },
    {
      icon: '🎤',
      title: 'AI Mock Interviews',
      description: 'Practice with AI interviewer for real-world experience',
      gradient: 'from-green-400 to-blue-600',
      delay: 0.2
    },
    {
      icon: '📊',
      title: 'Deep Analytics',
      description: 'Track progress with detailed performance insights',
      gradient: 'from-purple-400 to-pink-600',
      delay: 0.3
    },
    {
      icon: '📚',
      title: 'Smart Study Plans',
      description: 'AI-generated personalized learning roadmaps',
      gradient: 'from-yellow-400 to-red-600',
      delay: 0.4
    }
  ];

  const stats = [
    { number: '10K+', label: 'Students Placed', icon: '🎓' },
    { number: '95%', label: 'Success Rate', icon: '📈' },
    { number: '500+', label: 'Companies', icon: '🏢' },
    { number: '24/7', label: 'AI Support', icon: '🤖' }
  ];

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 lg:py-32">
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* AI Avatar with enhanced effects */}
            <div className="mb-8 relative">
              <AIAvatar isActive={true} size="xl" variant="holographic" />
              
              {/* Simplified floating elements around avatar */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full"
                  animate={{
                    x: [0, Math.cos(i * 90 * Math.PI / 180) * 60],
                    y: [0, Math.sin(i * 90 * Math.PI / 180) * 60],
                    opacity: [0, 0.8, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut"
                  }}
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    willChange: 'transform, opacity'
                  }}
                />
              ))}
            </div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-7xl font-bold mt-8 mb-6 px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Your Personal{' '}
              <GradientText variant="primary" animate={true} className="neon-text">
                AI Placement Coach
              </GradientText>
            </motion.h1>
            
            <motion.p 
              className={`text-lg sm:text-xl lg:text-2xl ${textSecondary} mb-8 max-w-3xl mx-auto px-4 leading-relaxed`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Practice smarter. Interview better. Get placed faster.
              <br />
              <GradientText variant="fire" animate={true}>
                Master DSA, Aptitude, and Technical interviews
              </GradientText>{' '} with AI-powered preparation.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center px-4 max-w-lg sm:max-w-none mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/test-setup" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto" 
                  gradient={true} 
                  glow={true}
                  animate3D={true}
                >
                  🧠 Take AI Test
                </Button>
              </Link>
              <Link to="/mock-interview-setup" className="w-full sm:w-auto">
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="w-full sm:w-auto"
                  glow={true}
                  animate3D={true}
                >
                  🎤 Start Mock Interview
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 px-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`${cardBg} ${text} p-6 rounded-2xl text-center ${hover3D} ${glow} backdrop-blur-lg border ${isDark ? 'border-white/20' : 'border-gray-200'}`}
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className={`text-2xl sm:text-3xl font-bold ${gradientText} mb-1`}>
                  {stat.number}
                </div>
                <div className={`${textSecondary} text-sm`}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 px-4"
          >
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${text}`}>
              Why Choose{' '}
              <span className={gradientTextSecondary}>AI PlacementPrep</span>?
            </h2>
            <p className={`${textSecondary} text-lg sm:text-xl max-w-2xl mx-auto`}>
              Advanced AI technology meets placement preparation
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 px-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: feature.delay }}
                className={`${cardBg} ${text} p-6 sm:p-8 rounded-2xl text-center ${hover3D} ${floatingCard} backdrop-blur-lg border ${isDark ? 'border-white/20' : 'border-gray-200'} group relative overflow-hidden`}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`} />
                
                <motion.div 
                  className="text-5xl sm:text-6xl mb-4 relative z-10"
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: [0, -10, 10, 0],
                    y: -10
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {feature.icon}
                </motion.div>
                
                <h3 className={`text-xl sm:text-2xl font-semibold mb-3 ${gradientText} relative z-10`}>
                  {feature.title}
                </h3>
                
                <p className={`${textSecondary} text-sm sm:text-base leading-relaxed relative z-10`}>
                  {feature.description}
                </p>
                
                {/* Animated border */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} p-[1px]`}>
                    <div className={`w-full h-full rounded-2xl ${cardBg}`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className={`${cardBg} ${text} p-8 sm:p-12 lg:p-16 rounded-3xl max-w-5xl mx-auto backdrop-blur-lg border ${isDark ? 'border-white/20' : 'border-gray-200'} ${glow} relative overflow-hidden`}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-500/20 to-pink-500/20 animate-pulse" />
            </div>
            
            <div className="text-center relative z-10">
              <motion.h2 
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Ready to{' '}
                <span className={`${gradientTextSecondary} neon-text`}>
                  Ace Your Placements
                </span>?
              </motion.h2>
              
              <motion.p 
                className={`text-lg sm:text-xl lg:text-2xl ${textSecondary} mb-8 max-w-3xl mx-auto leading-relaxed`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Join thousands of students who have improved their placement chances with{' '}
                <span className={gradientText}>AI-powered preparation</span>
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-6 justify-center max-w-lg sm:max-w-none mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link to="/register" className="w-full sm:w-auto">
                  <Button 
                    size="xl" 
                    className="w-full sm:w-auto" 
                    gradient={true}
                    glow={true}
                    animate3D={true}
                  >
                    🚀 Get Started Free
                  </Button>
                </Link>
                <Link to="/login" className="w-full sm:w-auto">
                  <Button 
                    variant="ghost" 
                    size="xl" 
                    className="w-full sm:w-auto"
                    glow={true}
                    animate3D={true}
                  >
                    👋 Already have an account?
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;