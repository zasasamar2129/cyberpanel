import React, { useState } from 'react';

const Broadcast: React.FC = () => {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSend = () => {
        if (!message.trim()) return;
        
        setIsSending(true);
        setSendStatus('idle');
        
        // Mock API call
        setTimeout(() => {
            console.log('Broadcasting message:', message);
            setIsSending(false);
            setSendStatus('success');
            setMessage('');
            
            setTimeout(() => setSendStatus('idle'), 3000);
        }, 1500);
    };

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="bg-light-surface dark:bg-cyber-surface p-6 rounded-lg border border-light-border dark:border-cyber-border shadow-light-panel dark:shadow-cyber-panel">
                <h3 className="text-xl font-display font-bold mb-4 text-light-text-primary dark:text-white">Broadcast Message</h3>
                <p className="text-sm text-light-text-secondary dark:text-gray-400 mb-6">Send a message to all active users of your bot. Use with caution.</p>
                
                <div className="space-y-4">
                    <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Type your message here... Supports basic markdown."
                        className="w-full h-48 p-4 font-sans text-base bg-light-bg dark:bg-cyber-bg border border-light-border dark:border-cyber-border rounded-md focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-cyber-primary transition-all"
                        disabled={isSending}
                    />
                    <div className="flex justify-between items-center">
                        <div>
                            {sendStatus === 'success' && <p className="text-green-500 dark:text-green-400">Broadcast sent successfully!</p>}
                            {sendStatus === 'error' && <p className="text-red-600 dark:text-red-500">Failed to send broadcast.</p>}
                        </div>
                        <button
                            onClick={handleSend}
                            disabled={isSending || !message.trim()}
                            className="px-6 py-2 bg-light-secondary dark:bg-cyber-secondary text-white font-bold rounded-md hover:opacity-90 dark:hover:shadow-cyber-glow-secondary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSending ? 'Sending...' : 'Send Broadcast'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Broadcast;
