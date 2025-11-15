
import React from 'react';
import Terminal from '../components/Terminal';

const TerminalPage: React.FC = () => {
    return (
        <div className="animate-fade-in flex flex-col h-[calc(100vh-10rem)] bg-light-surface dark:bg-cyber-surface p-6 rounded-lg border border-light-border dark:border-cyber-border shadow-light-panel dark:shadow-cyber-panel">
            <h3 className="text-xl font-display font-bold mb-4">Full-Screen Terminal</h3>
            <div className="flex-grow">
                <Terminal />
            </div>
        </div>
    );
};

export default TerminalPage;
