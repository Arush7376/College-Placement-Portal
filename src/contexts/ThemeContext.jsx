import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);
  const [lightThemeVariant, setLightThemeVariant] = useState('vibrant'); // vibrant, soft, pastel

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedVariant = localStorage.getItem('lightThemeVariant');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
    if (savedVariant) {
      setLightThemeVariant(savedVariant);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const changeLightThemeVariant = (variant) => {
    setLightThemeVariant(variant);
    localStorage.setItem('lightThemeVariant', variant);
  };

  const getLightBackground = () => {
    switch (lightThemeVariant) {
      case 'soft':
        return 'gradient-bg-light-soft min-h-screen';
      case 'pastel':
        return 'gradient-bg-light-pastel min-h-screen';
      default:
        return 'gradient-bg-light min-h-screen';
    }
  };

  const theme = {
    isDark,
    toggleTheme,
    lightThemeVariant,
    changeLightThemeVariant,
    // Background gradients
    bg: isDark 
      ? 'gradient-bg-dark min-h-screen' 
      : getLightBackground(),
    
    // Card backgrounds with advanced glass effects
    cardBg: isDark 
      ? 'glass-card' 
      : 'bg-white/90 backdrop-blur-lg border border-gray-300 shadow-xl',
    
    // Text colors
    text: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-700',
    textAccent: isDark ? 'text-blue-400' : 'text-blue-800',
    
    // Border styles
    border: isDark ? 'border-white/20' : 'border-gray-200',
    borderAccent: isDark ? 'border-blue-400/30' : 'border-blue-300',
    
    // Input styles
    input: isDark 
      ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' 
      : 'bg-white/95 border-gray-400 text-gray-900 placeholder-gray-600',
    
    // Hover effects
    hover: isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200/80',
    hoverAccent: isDark ? 'hover:bg-blue-500/20' : 'hover:bg-blue-200/80',
    
    // Button gradients
    buttonPrimary: 'btn-gradient text-white font-semibold',
    buttonSecondary: isDark 
      ? 'border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white' 
      : 'border-2 border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white bg-white/80',
    
    // Glow effects
    glow: isDark ? 'ai-glow' : 'shadow-lg shadow-blue-200',
    glowPurple: isDark ? 'ai-glow-purple' : 'shadow-lg shadow-purple-200',
    glowGreen: isDark ? 'ai-glow-green' : 'shadow-lg shadow-green-200',
    glowPink: isDark ? 'ai-glow-pink' : 'shadow-lg shadow-pink-200',
    
    // Gradient text
    gradientText: 'gradient-text',
    gradientTextSecondary: 'gradient-text-fire',
    
    // Special effects
    particles: 'particles',
    morphBlob: 'morph-blob',
    neonText: 'neon-text',
    
    // Animation classes
    floatingCard: 'card-floating',
    hover3D: 'card-hover-3d',
    pulseGlow: 'animate-pulse-glow',
    bounceFloat: 'animate-bounce-slow',
    scalePulse: 'animate-scale-pulse',
  };

  return (
    <ThemeContext.Provider value={theme}>
      <div className={`${theme.bg} ${theme.text} transition-all duration-500 relative overflow-hidden`}>
        {/* Animated background particles - Optimized */}
        <div className="fixed inset-0 pointer-events-none opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>
        </div>
        
        {/* Floating gradient orbs - Optimized */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {isDark ? (
            <>
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/15 to-purple-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/15 to-yellow-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-green-400/8 to-blue-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
            </>
          ) : (
            <>
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-white/20 to-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-yellow-200/15 to-green-200/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
              <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-cyan-200/15 to-blue-300/15 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '3s' }}></div>
              <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-br from-rose-200/15 to-pink-300/15 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>
            </>
          )}
        </div>
        
        {/* Main content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;