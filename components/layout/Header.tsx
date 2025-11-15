import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { SunIcon, MoonIcon, LogoutIcon, UserCircleIcon } from '../Icons';
import { Page } from '../../types';
import { mockProfile } from '../../mockApi';
import { AdminUser } from '../../types';

interface HeaderProps {
  currentPageLabel: string;
  onLogout: () => void;
  setCurrentPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPageLabel, onLogout, setCurrentPage }) => {
  const { theme, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mockProfile().then(setAdminUser);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between p-4 bg-light-surface dark:bg-cyber-surface border-b border-light-border dark:border-cyber-border">
      <h2 className="text-2xl font-display text-light-text-primary dark:text-gray-100">{currentPageLabel}</h2>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-light-text-secondary dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-cyber-bg transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <SunIcon className="w-6 h-6 text-cyber-accent" /> : <MoonIcon className="w-6 h-6 text-light-secondary" />}
        </button>
        
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setProfileOpen(prev => !prev)} className="flex items-center space-x-2">
            <img src={adminUser?.avatar} alt={adminUser?.username} className="w-8 h-8 rounded-full border-2 border-light-primary/50 dark:border-cyber-primary/50" />
            <span className="hidden sm:inline text-light-text-secondary dark:text-gray-300">{adminUser?.username}</span>
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-light-surface dark:bg-cyber-surface rounded-md shadow-lg py-1 z-50 border border-light-border dark:border-cyber-border">
              <button 
                onClick={() => { setCurrentPage('profile'); setProfileOpen(false); }} 
                className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-light-text-primary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-cyber-primary/10 transition-colors"
              >
                <UserCircleIcon className="w-5 h-5" />
                <span>Profile</span>
              </button>
              <button 
                onClick={onLogout} 
                className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-red-700 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10 transition-colors"
              >
                <LogoutIcon className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;