import { BrowserRouter as Router } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    
    const handleUserChange = () => {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener('userChanged', handleUserChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userChanged', handleUserChange);
    };
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar user={user} />
          <AppRoutes />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;