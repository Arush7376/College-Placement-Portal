import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useMemo } from 'react';

const AIAvatar = ({ isActive = false, size = 'md', variant = 'default' }) => {
  const { isDark, glow } = useTheme();
  
  const sizes = {
    xs: 'w-12 h-12',
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64'
  };

  const variants = {
    default: 'bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500',
    success: 'bg-gradient-to-br from-green-400 via-blue-500 to-purple-600',
    warning: 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500',
    danger: 'bg-gradient-to-br from-red-400 via-pink-500 to-purple-600',
    neon: 'bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600',
    holographic: 'bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500'
  };

  // Memoize animation variants to prevent recreation on each render
  const animationVariants = useMemo(() => ({
    outerRing: {
      inactive: { scale: 1, rotate: 0, opacity: 0.7 },
      active: {
        scale: [1, 1.15, 1],
        rotate: [0, 360],
        opacity: [0.5, 0.9, 0.5],
        transition: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.5, 1]
        }
      }
    },
    middleRing: {
      inactive: { scale: 1, rotate: 0 },
      active: {
        scale: [1, 1.08, 1],
        rotate: [0, -180],
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    mainContainer: {
      inactive: { scale: 1, rotateY: 0 },
      active: {
        scale: [1, 1.03, 1],
        rotateY: [0, 360],
        transition: {
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    robotEmoji: {
      inactive: { scale: 1, rotateZ: 0 },
      active: {
        scale: [1, 1.05, 1],
        rotateZ: [0, 5, -5, 0],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    statusIndicator: {
      inactive: { scale: 1, opacity: 1 },
      active: {
        scale: [1, 1.2, 1],
        opacity: [1, 0.8, 1],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    }
  }), []);

  // Memoize particle positions to prevent recalculation
  const particlePositions = useMemo(() => 
    Array.from({ length: 6 }, (_, i) => ({
      x: Math.cos(i * 60 * Math.PI / 180) * 25,
      y: Math.sin(i * 60 * Math.PI / 180) * 25,
      delay: i * 0.15
    })), []
  );

  return (
    <div className={`${sizes[size]} mx-auto relative`}>
      {/* Outer glow ring - Optimized */}
      <motion.div
        variants={animationVariants.outerRing}
        animate={isActive ? 'active' : 'inactive'}
        className={`absolute inset-0 ${variants[variant]} rounded-full blur-lg`}
        style={{ willChange: 'transform, opacity' }}
      />
      
      {/* Middle ring - Optimized */}
      <motion.div
        variants={animationVariants.middleRing}
        animate={isActive ? 'active' : 'inactive'}
        className={`absolute inset-2 ${variants[variant]} rounded-full blur-sm opacity-80`}
        style={{ willChange: 'transform' }}
      />
      
      {/* Main avatar container - Optimized */}
      <motion.div
        variants={animationVariants.mainContainer}
        animate={isActive ? 'active' : 'inactive'}
        className={`
          w-full h-full ${variants[variant]} rounded-full flex items-center justify-center 
          ${glow} relative overflow-hidden backdrop-blur-sm
          border-2 ${isDark ? 'border-white/30' : 'border-white/50'}
        `}
        style={{ willChange: 'transform' }}
      >
        {/* Inner gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-full" />
        
        {/* Rotating inner container - Simplified */}
        <motion.div
          animate={isActive ? { rotate: 360 } : { rotate: 0 }}
          transition={{
            duration: 12,
            repeat: isActive ? Infinity : 0,
            ease: "linear"
          }}
          className="relative z-10"
          style={{ willChange: 'transform' }}
        >
          {/* AI Robot emoji with optimized styling */}
          <motion.div
            variants={animationVariants.robotEmoji}
            animate={isActive ? 'active' : 'inactive'}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl filter drop-shadow-lg"
            style={{
              textShadow: '0 0 15px rgba(255,255,255,0.4)',
              willChange: 'transform'
            }}
          >
            🤖
          </motion.div>
        </motion.div>
        
        {/* Optimized floating particles - Reduced count */}
        {isActive && (
          <>
            {particlePositions.slice(0, 4).map((pos, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                animate={{
                  x: [0, pos.x],
                  y: [0, pos.y],
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: pos.delay,
                  ease: "easeOut"
                }}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  willChange: 'transform, opacity'
                }}
              />
            ))}
          </>
        )}
      </motion.div>
      
      {/* Status indicator - Optimized */}
      {isActive && (
        <motion.div
          variants={animationVariants.statusIndicator}
          animate="active"
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full shadow-lg"
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-ping opacity-60" />
        </motion.div>
      )}
      
      {/* Simplified pulse rings - Reduced count */}
      {isActive && (
        <>
          <motion.div
            animate={{
              scale: [1, 1.6, 1],
              opacity: [0.4, 0, 0.4]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeOut"
            }}
            className={`absolute inset-0 ${variants[variant]} rounded-full border-2 ${isDark ? 'border-white/20' : 'border-white/40'}`}
            style={{ willChange: 'transform, opacity' }}
          />
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.3, 0, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: 1,
              ease: "easeOut"
            }}
            className={`absolute inset-0 ${variants[variant]} rounded-full border-2 ${isDark ? 'border-white/15' : 'border-white/30'}`}
            style={{ willChange: 'transform, opacity' }}
          />
        </>
      )}
    </div>
  );
};

export default AIAvatar;