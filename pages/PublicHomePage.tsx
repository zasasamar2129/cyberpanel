
import React from 'react';
import { PowerIcon, SunIcon, MoonIcon } from '../components/Icons';
import { useTheme } from '../contexts/ThemeContext';
import CyberCat from '../components/CyberCat';

interface PublicHomePageProps {
    onLoginClick: () => void;
}

const PublicHomePage: React.FC<PublicHomePageProps> = ({ onLoginClick }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className={`min-h-screen font-sans flex flex-col items-center justify-center p-4 relative transition-colors duration-500
            ${theme === 'dark' ? 'bg-cyber-bg text-gray-300' : 'bg-light-bg text-light-text-primary'} animated-grid-bg`}>
            
            <CyberCat />

            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-light-text-secondary dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-cyber-bg transition-colors"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? <SunIcon className="w-6 h-6 text-cyber-accent" /> : <MoonIcon className="w-6 h-6 text-light-secondary" />}
                </button>
            </div>

            <div className="text-center mb-12 relative z-10">
                <PowerIcon className="h-20 w-20 text-light-primary dark:text-cyber-primary mx-auto animate-flicker" />
                <h1 className="mt-4 text-5xl font-display font-bold text-light-primary dark:text-cyber-primary tracking-widest uppercase">
                    CyberPanel
                </h1>
                <p className="text-light-text-secondary dark:text-gray-400 mt-2 text-lg">Telegram Bot Management System</p>
            </div>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 relative z-10">
                <div className="bg-light-surface/80 dark:bg-cyber-surface/50 backdrop-blur-sm p-6 rounded-lg border border-light-border dark:border-cyber-border shadow-light-panel dark:shadow-cyber-panel">
                    <h2 className="text-2xl font-display text-light-secondary dark:text-cyber-secondary mb-4">About</h2>
                    <p className="text-light-text-secondary dark:text-gray-400">
                        CyberPanel is a futuristic, cyberpunk-themed admin dashboard designed for comprehensive management of your Telegram bot. Monitor system stats, manage users, broadcast messages, and interact directly with your bot's environment through a sleek, intuitive interface.
                    </p>
                </div>
                <div className="bg-light-surface/80 dark:bg-cyber-surface/50 backdrop-blur-sm p-6 rounded-lg border border-light-border dark:border-cyber-border shadow-light-panel dark:shadow-cyber-panel">
                    <h2 className="text-2xl font-display text-light-secondary dark:text-cyber-secondary mb-4">Contact</h2>
                    <p className="text-light-text-secondary dark:text-gray-400">
                        For support, feature requests, or inquiries, please reach out via the official channels.
                    </p>
                    <div className="mt-2 space-y-1">
                        <p><strong>Email:</strong> support@example.bot</p>
                        <p><strong>Telegram:</strong> @BotSupportAdmin</p>
                    </div>
                </div>
            </div>

            <div className="relative z-10">
                <button
                    onClick={onLoginClick}
                    className="w-full px-12 py-4 bg-light-primary dark:bg-cyber-primary/90 text-white dark:text-cyber-bg font-bold rounded-md hover:opacity-90 dark:hover:bg-cyber-primary dark:hover:shadow-cyber-glow transition-all duration-300 transform hover:scale-105 text-lg"
                >
                    Access Panel
                </button>
            </div>

            <footer className="absolute bottom-4 text-center text-xs text-light-text-secondary dark:text-gray-500 z-10">
                <p>CyberPanel v1.0 &copy; 2024 Your Bot</p>
            </footer>
        </div>
    );
};

export default PublicHomePage;