import { motion } from 'framer-motion';

const GradientText = ({ 
  children, 
  className = '', 
  variant = 'primary',
  animate = false 
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500',
    secondary: 'bg-gradient-to-r from-green-400 via-blue-500 to-purple-600',
    fire: 'bg-gradient-to-r from-orange-400 via-red-500 to-pink-500',
    rainbow: 'bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-500'
  };

  const Component = animate ? motion.span : 'span';
  const animationProps = animate ? {
    animate: { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] },
    transition: { duration: 3, repeat: Infinity, ease: 'linear' }
  } : {};

  return (
    <Component
      className={`
        ${variants[variant]} 
        bg-clip-text text-transparent 
        bg-[length:200%_200%]
        ${className}
      `}
      style={{
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}
      {...animationProps}
    >
      {children}
    </Component>
  );
};

export default GradientText;