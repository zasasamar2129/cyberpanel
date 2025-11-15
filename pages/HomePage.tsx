
import React, { useState, useEffect } from 'react';
import { SystemStats } from '../types';
import { mockSystemStats } from '../mockApi';
import { Page } from '../types';
import { ServerIcon, UsersIcon, TerminalIcon, CogIcon } from '../components/Icons';

interface HomePageProps {
    setCurrentPage: (page: Page) => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; isOnline: boolean }> = ({ title, value, icon, isOnline }) => {
    const color = isOnline ? 'green' : 'red';
    return (
        <div className="bg-light-surface dark:bg-cyber-surface p-6 rounded-lg border border-light-border dark:border-cyber-border shadow-light-panel dark:shadow-cyber-panel flex items-center space-x-4">
            <div className={`p-3 rounded-full bg-${color}-500/10 text-${color}-500`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-light-text-secondary dark:text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-light-text-primary dark:text-gray-100">{value}</p>
            </div>
        </div>
    );
};

const NavCard: React.FC<{ title: string; description: string; icon: React.ReactNode; onClick: () => void; }> = ({ title, description, icon, onClick }) => (
    <button onClick={onClick} className="text-left w-full bg-light-surface dark:bg-cyber-surface p-6 rounded-lg border border-light-border dark:border-cyber-border shadow-light-panel dark:shadow-cyber-panel transition-all hover:border-light-primary dark:hover:border-cyber-primary hover:-translate-y-1">
        <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-light-primary/10 text-light-primary dark:bg-cyber-primary/10 dark:text-cyber-primary">
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-bold font-display text-light-text-primary dark:text-white">{title}</h3>
                <p className="text-sm text-light-text-secondary dark:text-gray-400 mt-1">{description}</p>
            </div>
        </div>
    </button>
);


const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
    const [stats, setStats] = useState<SystemStats | null>(null);

    useEffect(() => {
        mockSystemStats().then(setStats);
        const interval = setInterval(() => {
            mockSystemStats().then(setStats);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const isOnline = stats?.status === 'Online';

    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-display text-light-text-primary dark:text-white">Welcome, Admin</h1>
                <p className="text-light-text-secondary dark:text-gray-400 mt-1">This is your central command hub.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard title="Bot Status" value={stats?.status || 'Loading...'} icon={<ServerIcon className="h-6 w-6"/>} isOnline={isOnline} />
                <StatCard title="Process ID" value={stats?.pid?.toString() || 'N/A'} icon={<ServerIcon className="h-6 w-6"/>} isOnline={isOnline} />
            </div>

            <div>
                <h2 className="text-xl font-display text-light-text-primary dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <NavCard title="Dashboard" description="View system metrics" icon={<ServerIcon className="h-6 w-6"/>} onClick={() => setCurrentPage('dashboard')} />
                    <NavCard title="Manage Users" description="Ban, unban, and edit users" icon={<UsersIcon className="h-6 w-6"/>} onClick={() => setCurrentPage('users')} />
                    <NavCard title="Terminal" description="Direct command-line access" icon={<TerminalIcon className="h-6 w-6"/>} onClick={() => setCurrentPage('terminal')} />
                    <NavCard title="Bot Settings" description="Configure bot parameters" icon={<CogIcon className="h-6 w-6"/>} onClick={() => setCurrentPage('settings')} />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
