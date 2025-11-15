
import React, { useState } from 'react';
import { PowerIcon, UserCircleIcon, LockClosedIcon, ArrowLeftIcon } from '../components/Icons';

interface LoginPageProps {
  onLogin: () => void;
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This is a mock login. In a real app, you'd call an API.
    if (username === 'admin' && password === 'password') {
      setError('');
      onLogin();
    } else {
      setError('Invalid credentials. [Hint: admin/password]');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-bg font-sans p-4 animate-fade-in">
      <div className="w-full max-w-md bg-cyber-surface/80 backdrop-blur-sm border border-cyber-border rounded-lg shadow-cyber-panel p-8 relative">
        <button onClick={onBack} className="absolute top-4 left-4 text-gray-400 hover:text-cyber-primary transition-colors">
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <div className="text-center mb-8">
          <PowerIcon className="h-16 w-16 text-cyber-primary mx-auto animate-flicker" />
          <h1 className="mt-4 text-3xl font-display font-bold text-cyber-primary tracking-widest uppercase">
            System Access
          </h1>
          <p className="text-gray-400 mt-2">Authorize to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <UserCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-cyber-primary/50" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-cyber-bg border border-cyber-border text-gray-200 rounded-md py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-cyber-primary focus:border-transparent transition-all"
            />
          </div>
          <div className="relative">
            <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-cyber-primary/50" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-cyber-bg border border-cyber-border text-gray-200 rounded-md py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-cyber-primary focus:border-transparent transition-all"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-cyber-primary/90 text-cyber-bg font-bold rounded-md hover:bg-cyber-primary hover:shadow-cyber-glow transition-all duration-300 transform hover:scale-105"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
