import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  className = '',
  type = 'button',
  glow = false,
  gradient = false,
  animate3D = false
}) => {
  const { isDark } = useTheme();
  
  const baseClasses = 'font-semibold rounded-xl transition-all duration-300 flex items-center justify-center relative overflow-hidden transform-gpu';
  
  const variants = {
    primary: gradient 
      ? 'btn-gradient text-white shadow-lg' 
      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl',
    secondary: isDark 
      ? 'border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white backdrop-blur-sm' 
      : 'border-2 border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white backdrop-blur-sm bg-white/90',
    success: gradient
      ? 'gradient-bg-success text-white shadow-lg'
      : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl',
    warning: gradient
      ? 'gradient-bg-warning text-white shadow-lg'
      : 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg hover:shadow-xl',
    danger: gradient
      ? 'gradient-bg-danger text-white shadow-lg'
      : 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl',
    ghost: isDark
      ? 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20'
      : 'bg-white/90 hover:bg-white text-gray-900 backdrop-blur-sm border border-gray-400',
    neon: `neon-border ${isDark ? 'text-cyan-400 border-cyan-400' : 'text-blue-800 border-blue-800'} bg-transparent hover:bg-current hover:text-white`,
  };
  
  const sizes = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  const glowClasses = glow ? (
    variant === 'primary' ? 'ai-glow' :
    variant === 'success' ? 'ai-glow-green' :
    variant === 'danger' ? 'ai-glow-pink' :
    'ai-glow'
  ) : '';

  const animate3DClasses = animate3D ? 'btn-3d' : '';

  return (
    <motion.button
      whileHover={{ 
        scale: disabled ? 1 : 1.05,
        rotateX: animate3D ? 5 : 0,
        y: animate3D ? -2 : 0
      }}
      whileTap={{ 
        scale: disabled ? 1 : 0.95,
        rotateX: animate3D ? 10 : 0,
        y: animate3D ? -1 : 0
      }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`
        ${baseClasses} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${glowClasses}
        ${animate3DClasses}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} 
        ${className}
      `}
    >
      {/* Shimmer effect for gradient buttons */}
      {gradient && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
        </div>
      )}
      
      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        initial={{ scale: 0, opacity: 0.5 }}
        whileTap={{ scale: 1, opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)'
        }}
      />
    </motion.button>
  );
};

export default Button;