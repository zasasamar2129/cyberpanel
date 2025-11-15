import React, { useState, useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { mockLogStream } from '../mockApi';
import { DownloadIcon } from '../components/Icons';

const getLogLevelColor = (level: LogEntry['level'], theme: 'light' | 'dark') => {
    if (theme === 'light') {
        switch (level) {
            case 'INFO': return 'text-indigo-500';
            case 'WARN': return 'text-yellow-600';
            case 'ERROR': return 'text-red-600';
            case 'DEBUG': return 'text-gray-500';
            default: return 'text-gray-800';
        }
    }
    switch (level) {
        case 'INFO': return 'text-cyber-primary';
        case 'WARN': return 'text-yellow-400';
        case 'ERROR': return 'text-red-500';
        case 'DEBUG': return 'text-gray-500';
        default: return 'text-gray-300';
    }
};

const useThemeDetector = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    useEffect(() => {
        const checkTheme = () => document.documentElement.classList.contains('dark') ? setTheme('dark') : setTheme('light');
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);
    return theme;
}

const Logs: React.FC = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const logContainerRef = useRef<HTMLDivElement>(null);
    const theme = useThemeDetector();

    useEffect(() => {
        const stopStreaming = mockLogStream((newLog) => {
            setLogs(prevLogs => [...prevLogs.slice(-200), newLog]); // Keep logs from getting too long
        });

        return () => stopStreaming();
    }, []);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    const handleDownload = () => {
        const logText = logs.map(log => `[${log.timestamp}] [${log.level}] ${log.message}`).join('\n');
        const blob = new Blob([logText], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `bot-logs-${new Date().toISOString()}.txt`;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    return (
        <div className="animate-fade-in flex flex-col h-[calc(100vh-10rem)] bg-light-surface dark:bg-cyber-surface p-6 rounded-lg border border-light-border dark:border-cyber-border shadow-light-panel dark:shadow-cyber-panel">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-display font-bold">Bot Logs (Live)</h3>
                <button 
                    onClick={handleDownload}
                    className="flex items-center space-x-2 px-4 py-2 bg-light-primary/10 text-light-primary dark:bg-cyber-primary/10 dark:text-cyber-primary rounded-lg hover:bg-light-primary/20 dark:hover:bg-cyber-primary/20 transition-colors"
                >
                    <DownloadIcon className="h-5 w-5" />
                    <span>Download Log</span>
                </button>
            </div>
            <div
                ref={logContainerRef}
                className="flex-1 overflow-y-auto bg-light-bg dark:bg-cyber-bg p-4 rounded-md font-mono text-sm border border-light-border dark:border-cyber-border"
            >
                {logs.map((log, index) => (
                    <div key={index} className="flex">
                        <span className="text-light-text-secondary dark:text-gray-500 mr-4">{log.timestamp}</span>
                        <span className={`${getLogLevelColor(log.level, theme)} font-bold w-16`}>[{log.level}]</span>
                        <span className="flex-1 text-light-text-primary dark:text-gray-300 whitespace-pre-wrap">{log.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Logs;
