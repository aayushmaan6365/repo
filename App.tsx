
import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './components/LanguageContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { User, Theme } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogin = (email: string) => {
    setUser({ email, name: email.split('@')[0] });
  };

  const handleLogout = () => {
    setUser(null);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        {!user ? (
          <Login onLogin={handleLogin} theme={theme} onToggleTheme={toggleTheme} />
        ) : (
          <Dashboard 
            user={user} 
            onLogout={handleLogout} 
            theme={theme} 
            onToggleTheme={toggleTheme} 
          />
        )}
      </div>
    </LanguageProvider>
  );
};

export default App;
