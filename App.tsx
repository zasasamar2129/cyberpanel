
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Logs from './pages/Logs';
import Broadcast from './pages/Broadcast';
import Admins from './pages/Admins';
import Profile from './pages/Profile';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import { Page, NavItem } from './types';
import { HomeIcon, UsersIcon, CogIcon, TerminalIcon, SpeakerphoneIcon, ShieldCheckIcon, ServerIcon } from './components/Icons';
import PublicHomePage from './pages/PublicHomePage';
import HomePage from './pages/HomePage';
import TerminalPage from './pages/TerminalPage';

const AppContent: React.FC = () => {
    const [view, setView] = useState<'public' | 'login' | 'app'>('public');
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const { theme } = useTheme();
    const { settings } = useSettings();

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);
    
    useEffect(() => {
        document.title = settings.title;
        const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
        if (favicon && settings.favicon) {
            favicon.href = settings.favicon;
        }
    }, [settings]);

    const handleLogin = useCallback(() => {
        setView('app');
        setCurrentPage('home');
    }, []);

    const handleLogout = useCallback(() => {
        setView('public');
    }, []);

    const navigationItems: NavItem[] = useMemo(() => [
        { id: 'home', label: 'Home', icon: <HomeIcon /> },
        { id: 'dashboard', label: 'Dashboard', icon: <ServerIcon /> },
        { id: 'users', label: 'Users', icon: <UsersIcon /> },
        { id: 'broadcast', label: 'Broadcast', icon: <SpeakerphoneIcon /> },
        { id: 'logs', label: 'Logs', icon: <TerminalIcon /> },
        { id: 'terminal', label: 'Terminal', icon: <TerminalIcon /> },
        { id: 'admins', label: 'Admins', icon: <ShieldCheckIcon /> },
        { id: 'settings', label: 'Settings', icon: <CogIcon /> },
    ], []);

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage setCurrentPage={setCurrentPage} />;
            case 'dashboard':
                return <Dashboard />;
            case 'users':
                return <Users />;
            case 'broadcast':
                return <Broadcast />;
            case 'logs':
                return <Logs />;
            case 'terminal':
                return <TerminalPage />;
            case 'admins':
                return <Admins />;
            case 'settings':
                return <Settings />;
            case 'profile':
                return <Profile />;
            default:
                return <HomePage setCurrentPage={setCurrentPage} />;
        }
    };

    if (view === 'public') {
        return <PublicHomePage onLoginClick={() => setView('login')} />;
    }

    if (view === 'login') {
        return <LoginPage onLogin={handleLogin} onBack={() => setView('public')} />;
    }

    return (
        <div className="flex h-screen bg-light-bg dark:bg-cyber-bg text-light-text-primary dark:text-gray-200 font-sans">
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} navigationItems={navigationItems} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    currentPageLabel={navigationItems.find(item => item.id === currentPage)?.label || 'Profile'} 
                    onLogout={handleLogout} 
                    setCurrentPage={setCurrentPage}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <SettingsProvider>
                <AppContent />
            </SettingsProvider>
        </ThemeProvider>
    );
};

export default App;