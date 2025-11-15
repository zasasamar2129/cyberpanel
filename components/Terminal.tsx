
import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { mockSystemStats } from '../mockApi';
import { SystemStats } from '../types';

interface TerminalProps {
    height?: string;
}

interface HistoryItem {
    command: string;
    output: React.ReactNode;
}

const Terminal: React.FC<TerminalProps> = ({ height }) => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const endOfTerminalRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        endOfTerminalRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [history]);

    const handleCommand = async (command: string) => {
        let output: React.ReactNode = `command not found: ${command}`;
        const [cmd, ...args] = command.trim().split(' ');

        switch (cmd.toLowerCase()) {
            case 'help':
                output = (
                    <div>
                        <p>Available commands:</p>
                        <ul className="list-disc list-inside">
                            <li><span className="text-cyber-primary">help</span> - Show this help message.</li>
                            <li><span className="text-cyber-primary">status</span> - Get current bot and system status.</li>
                            <li><span className="text-cyber-primary">ls</span> - List mock directories.</li>
                            <li><span className="text-cyber-primary">clear</span> - Clear the terminal screen.</li>
                        </ul>
                    </div>
                );
                break;
            case 'status':
                const stats: SystemStats = await mockSystemStats();
                output = (
                    <div>
                        <p>Bot Status: <span className={stats.status === 'Online' ? 'text-green-400' : 'text-red-400'}>{stats.status}</span> (PID: {stats.pid})</p>
                        <p>CPU: {stats.cpu}% | RAM: {stats.ram}% | Storage: {stats.storage}%</p>
                        <p>Connections: {stats.connections}</p>
                    </div>
                );
                break;
            case 'ls':
                 output = (
                    <div className="flex gap-4">
                        <span className="text-blue-400">/logs</span>
                        <span className="text-blue-400">/users</span>
                        <span className="text-green-400">config.env</span>
                    </div>
                );
                break;
            case 'clear':
                setHistory([]);
                return; // early return to avoid adding to history
            case '':
                // Do nothing for empty command
                setHistory(prev => [...prev, { command, output: ''}]);
                return;
        }

        setHistory(prev => [...prev, { command, output }]);
    };


    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput('');
        }
    };

    return (
        <div 
            className="bg-light-bg dark:bg-cyber-bg p-4 rounded-md font-mono text-sm border border-light-border dark:border-cyber-border h-full flex flex-col"
            style={{ height: height || '100%' }}
            onClick={() => document.getElementById('terminal-input')?.focus()}
        >
            <div className="flex-1 overflow-y-auto">
                {history.map((item, index) => (
                    <div key={index}>
                        <div className="flex items-center">
                            <span className="text-cyber-primary mr-2">$</span>
                            <span>{item.command}</span>
                        </div>
                        <div>{item.output}</div>
                    </div>
                ))}
                 <div ref={endOfTerminalRef} />
            </div>
            <div className="flex items-center mt-2">
                <span className="text-cyber-primary mr-2">$</span>
                <input
                    id="terminal-input"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-transparent border-none text-gray-300 w-full focus:outline-none"
                    autoFocus
                />
            </div>
        </div>
    );
};

export default Terminal;
