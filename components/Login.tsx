
import React, { useState } from 'react';
import { useLanguage } from './LanguageContext';
import { ShieldCheckIcon, LanguageIcon, MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { Theme } from '../types';

interface LoginProps {
  onLogin: (email: string) => void;
  theme: Theme;
  onToggleTheme: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, theme, onToggleTheme }) => {
  const { t, toggleLanguage, language } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="absolute top-8 right-8 z-10 flex items-center gap-4">
        <div className="flex bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur p-1 rounded-2xl shadow-sm border border-white/20">
          <button 
            onClick={() => theme !== 'light' && onToggleTheme()}
            className={`p-2 rounded-xl transition-all ${theme === 'light' ? 'bg-white shadow-lg text-indigo-600' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <SunIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={() => theme !== 'dark' && onToggleTheme()}
            className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'bg-slate-700 shadow-lg text-yellow-400' : 'text-slate-500 hover:text-slate-400'}`}
          >
            <MoonIcon className="w-5 h-5" />
          </button>
        </div>

        <button 
          onClick={toggleLanguage}
          className="group flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-blue-500 transition-all active:scale-95 font-bold text-sm tracking-tight"
        >
          <LanguageIcon className="w-5 h-5 text-blue-500 group-hover:rotate-12 transition-transform" />
          <span>{t.changeLang}</span>
        </button>
      </div>

      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-700 z-10">
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-800 transition-all duration-500">
          <div className="bg-blue-600 p-12 text-center relative overflow-hidden">
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl" />
            
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-slate-100 rounded-[2rem] shadow-2xl mb-8 transform hover:rotate-6 transition-transform duration-500">
              <ShieldCheckIcon className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
              FloodGuard AI
            </h1>
            <p className="text-blue-100 text-[10px] font-black opacity-80 uppercase tracking-[0.3em]">
              Risk Intelligence Platform
            </p>
          </div>

          <div className="p-10">
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-8 text-center tracking-tight">
              {isLogin ? t.login : t.signup}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5 ml-1">
                  {t.email}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-900 dark:text-slate-100 font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600"
                  placeholder="name@company.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5 ml-1">
                  {t.password}
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-900 dark:text-slate-100 font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-200 dark:shadow-none transition-all active:scale-[0.97] transform"
              >
                {isLogin ? t.login : t.signup}
              </button>
            </form>

            <div className="mt-10 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest"
              >
                {isLogin 
                  ? (language === 'hi' ? "नया खाता? साइन अप करें" : "New here? Create Account") 
                  : (language === 'hi' ? "पहले से सदस्य? लॉग इन करें" : "Member already? Sign In")
                }
              </button>
            </div>
          </div>
        </div>
        <p className="mt-10 text-center text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
          &copy; 2024 FloodGuard AI. Resilience through Data.
        </p>
      </div>
    </div>
  );
};

export default Login;
