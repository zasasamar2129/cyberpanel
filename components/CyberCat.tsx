import React, { useState, useEffect } from 'react';

const CyberCat: React.FC = () => {
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [showBubble, setShowBubble] = useState(false);

    useEffect(() => {
        const moveCat = () => {
            const newX = Math.random() * (window.innerWidth - 60);
            const newY = Math.random() * (window.innerHeight - 60);
            setPosition({ x: newX, y: newY });
        };
        const interval = setInterval(moveCat, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="fixed z-50 transition-all duration-[3000ms] ease-in-out"
            style={{ top: `${position.y}px`, left: `${position.x}px` }}
            onMouseEnter={() => setShowBubble(true)}
            onMouseLeave={() => setShowBubble(false)}
        >
            <div className="relative">
                {showBubble && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-cyber-surface border border-cyber-border rounded-lg text-cyber-primary text-sm whitespace-nowrap animate-fade-in">
                        Meow!
                    </div>
                )}
                 {/* Cute Cyber Cat */}
                <svg width="60" height="60" viewBox="0 0 100 100" className="drop-shadow-[0_0_5px_#00f6ff]">
                    <g stroke="#00f6ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        {/* Ears */}
                        <path d="M 25 35 Q 15 15, 40 25" fill="#0a0a1a" />
                        <path d="M 75 35 Q 85 15, 60 25" fill="#0a0a1a" />
                        
                        {/* Head */}
                        <path d="M 20 45 A 30 30 0 1 1 80 45 A 35 35 0 0 1 20 45" fill="#0a0a1a"/>
                        
                        {/* Collar with Bell */}
                        <path d="M 35 80 Q 50 90, 65 80" fill="none" stroke="#ff00ff" />
                        <circle cx="50" cy="85" r="4" fill="#faff00" stroke="#faff00" />

                        {/* Muzzle and Nose */}
                        <path d="M 40 60 Q 50 75, 60 60" fill="#0a0a1a" />
                        <path d="M 50 65 L 45 70 L 55 70 Z" fill="#ff00ff" />
                        
                        {/* Whiskers */}
                        <path d="M 35 58 L 15 55" />
                        <path d="M 35 65 L 10 65" />
                        <path d="M 65 58 L 85 55" />
                        <path d="M 65 65 L 90 65" />

                        {/* Eyes - with animation */}
                        <g style={{ animation: 'blink 4s infinite' }}>
                            <ellipse cx="38" cy="50" rx="8" ry="10" fill="#ff00ff" />
                            <ellipse cx="62" cy="50" rx="8" ry="10" fill="#ff00ff" />
                            {/* Pupils/Highlights */}
                            <circle cx="40" cy="48" r="2" fill="white" />
                            <circle cx="64" cy="48" r="2" fill="white" />
                        </g>
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default CyberCat;