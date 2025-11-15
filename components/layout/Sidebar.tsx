import React from 'react';
import { Page, NavItem } from '../../types';
import { PowerIcon } from '../Icons';
import { useSettings } from '../../contexts/SettingsContext';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  navigationItems: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, navigationItems }) => {
  const { settings } = useSettings();
  
  return (
    <aside className="w-16 md:w-64 bg-light-surface dark:bg-cyber-surface p-2 md:p-4 flex flex-col justify-between transition-all duration-300 border-r border-light-border dark:border-cyber-border">
      <div>
        <div className="flex items-center justify-center md:justify-start mb-10 p-2">
          {settings.logo ? (
            <img src={settings.logo} alt="Logo" className="h-8 w-8 object-contain" />
          ) : (
            <PowerIcon className="h-8 w-8 text-light-primary dark:text-cyber-primary animate-flicker" />
          )}
          <h1 className="hidden md:block ml-4 text-xl font-display font-bold text-light-primary dark:text-cyber-primary tracking-widest uppercase">
            Admin
          </h1>
        </div>
        <nav>
          <ul>
            {navigationItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center w-full p-3 my-2 rounded-lg transition-all duration-200 font-sans text-sm md:text-base 
                  ${currentPage === item.id 
                    ? 'bg-light-primary/10 text-light-primary dark:bg-cyber-primary/20 dark:text-cyber-primary border-r-4 border-light-primary dark:border-cyber-primary' 
                    : 'text-light-text-secondary dark:text-gray-400 hover:bg-light-primary/5 dark:hover:bg-cyber-primary/10 hover:text-light-primary dark:hover:text-cyber-primary'
                  }`}
                >
                  <span className="h-6 w-6">{item.icon}</span>
                  <span className="hidden md:block ml-4">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="p-2 text-center text-xs text-light-text-secondary dark:text-gray-500 hidden md:block">
        <p>{settings.copyright}</p>
      </div>
    </aside>
  );
};

export default Sidebar;