import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { SystemStats, User } from '../types';
import { mockUsers, mockSystemStats } from '../mockApi';
import { ServerIcon, UsersIcon, PowerIcon, RefreshIcon, CpuChipIcon, GlobeAltIcon } from '../components/Icons';
import Terminal from '../components/Terminal';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string; lightColor: string; subValue?: string; }> = ({ title, value, icon, color, lightColor, subValue }) => (
    <div className="bg-light-surface dark:bg-cyber-surface p-6 rounded-lg border border-light-border dark:border-cyber-border shadow-light-panel dark:shadow-cyber-panel flex items-center space-x-4 transition-all hover:border-light-primary dark:hover:border-cyber-primary/50">
        <div className={`p-3 rounded-full bg-${lightColor}-500/10 text-${lightColor}-500 dark:bg-${color}-500/10 dark:text-${color}-500`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-light-text-secondary dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-light-text-primary dark:text-gray-100">{value}</p>
            {subValue && <p className="text-xs text-light-text-secondary dark:text-gray-500">{subValue}</p>}
        </div>
    </div>
);

const GaugeChart: React.FC<{ value: number; maxValue: number; label: string; color: string; lightColor: string; unit: string; isPercentage?: boolean }> = ({ value, maxValue, label, color, lightColor, unit, isPercentage = true }) => {
    const { theme } = useTheme();
    const percentage = Math.round((value / maxValue) * 100);
    const data = [{ name: label, value: percentage }];
    const chartColor = theme === 'dark' ? color : lightColor;
    return (
        <div className="w-full h-48 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                    innerRadius="80%" 
                    outerRadius="100%" 
                    data={data} 
                    startAngle={180} 
                    endAngle={0}
                    barSize={15}
                >
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar 
                        background={{ fill: theme === 'dark' ? '#1a1a36' : '#e2e8f0' }}
                        dataKey='value' 
                        angleAxisId={0} 
                        fill={chartColor}
                        cornerRadius={10}
                    />
                </RadialBarChart>
            </ResponsiveContainer>
            <div className="text-center -mt-20">
                <p className="text-3xl font-bold font-display" style={{color: chartColor}}>{isPercentage ? `${percentage}%` : value}</p>
                <p className="text-sm text-light-text-secondary dark:text-gray-400">{label}</p>
                {isPercentage && <p className="text-xs text-light-text-secondary/80 dark:text-gray-500 mt-1">{`${value} ${unit} / ${maxValue} ${unit}`}</p>}
            </div>
        </div>
    );
};

// Dummy useTheme hook for GaugeChart since it's not in the main tree
const useTheme = () => {
    const [theme, setTheme] = useState('dark');
    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setTheme(isDark ? 'dark' : 'light');
        const observer = new MutationObserver(() => {
            const isDark = document.documentElement.classList.contains('dark');
            setTheme(isDark ? 'dark' : 'light');
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);
    return { theme };
};


const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<SystemStats>({ ram: 0, storage: 0, cpu: 0, connections: 0, ram_used_mb: 0, ram_total_mb: 0, storage_used_gb: 0, storage_total_gb: 0, network_speed_mbps: 0, network_max_mbps: 0, status: 'Offline', pid: 0 });
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        mockUsers().then(setUsers);
        mockSystemStats().then(setStats);
        const interval = setInterval(() => {
            mockSystemStats().then(setStats);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleAction = (action: string) => {
        // In a real app, this would trigger an API call
        alert(`Bot action triggered: ${action}`);
    };

    const isOnline = stats.status === 'Online';

    return (
        <div className="animate-fade-in space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={users.length.toString()} icon={<UsersIcon className="h-6 w-6"/>} color="cyber-primary" lightColor="indigo" />
                <StatCard title="Banned Users" value={users.filter(u => u.isBanned).length.toString()} icon={<UsersIcon className="h-6 w-6"/>} color="red" lightColor="red" />
                <StatCard title="Active Connections" value={stats.connections.toString()} icon={<GlobeAltIcon className="h-6 w-6"/>} color={isOnline ? 'green' : 'gray'} lightColor={isOnline ? 'green' : 'gray'} />
                <StatCard title="Bot Status" value={stats.status} subValue={isOnline ? `PID: ${stats.pid}`: ''} icon={<ServerIcon className="h-6 w-6"/>} color={isOnline ? 'green' : 'red'} lightColor={isOnline ? 'green' : 'red'} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <div className="bg-light-surface dark:bg-cyber-surface p-6 rounded-lg border border-light-border dark:border-cyber-border shadow-light-panel dark:shadow-cyber-panel">
                    <GaugeChart value={stats.ram_used_mb} maxValue={stats.ram_total_mb} label="RAM Used" color="#00f6ff" lightColor="#4338ca" unit="MB"/>
                </div>
                <div className="bg-light-surface dark:bg-cyber-surface p-6 rounded-lg border border-light-border dark:border-cyber-border shadow-light-panel dark:shadow-cyber-panel">
                    <GaugeChart value={stats.storage_used_gb} maxValue={stats.storage_total_gb} label="Storage Used" color="#ff00ff" lightColor="#c026d3" unit="GB"/>
                </div>
                <div className="bg-light-surface dark:bg-cyber-surface p-6 rounded-lg border border-light-border dark:border-cyber-border shadow-light-panel dark:shadow-cyber-panel">
                    <GaugeChart value={stats.cpu} maxValue={100} label="CPU Load" color="#faff00" lightColor="#ca8a04" unit="%"/>
                </div>
                 <div className="bg-light-surface dark:bg-cyber-surface p-6 rounded-lg border border-light-border dark:border-cyber-border shadow-light-panel dark:shadow-cyber-panel">
                    <GaugeChart value={stats.network_speed_mbps} maxValue={stats.network_max_mbps} label="Internet Speed" color="green" lightColor="green" unit="Mbps"/>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-light-surface dark:bg-cyber-surface p-6 rounded-lg border border-light-border dark:border-cyber-border shadow-light-panel dark:shadow-cyber-panel">
                    <h3 className="text-xl font-display text-light-text-primary dark:text-white font-bold mb-4">Quick Controls</h3>
                    <div className="flex flex-wrap gap-4">
                        <button onClick={() => handleAction('Restart')} className="flex items-center space-x-2 px-4 py-2 bg-yellow-500/10 text-yellow-500 rounded-lg hover:bg-yellow-500/20 transition-colors">
                            <RefreshIcon className="h-5 w-5" />
                            <span>Restart Bot</span>
                        </button>
                        <button onClick={() => handleAction('Shutdown')} className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors">
                            <PowerIcon className="h-5 w-5" />
                            <span>Shutdown Bot</span>
                        </button>
                         <button onClick={() => handleAction('Force Kill')} className="flex items-center space-x-2 px-4 py-2 bg-red-700/10 text-red-700 rounded-lg hover:bg-red-700/20 transition-colors">
                            <PowerIcon className="h-5 w-5" />
                            <span>Force Kill</span>
                        </button>
                    </div>
                </div>
                <div className="bg-light-surface dark:bg-cyber-surface p-6 rounded-lg border border-light-border dark:border-cyber-border shadow-light-panel dark:shadow-cyber-panel lg:row-span-2">
                     <h3 className="text-xl font-display text-light-text-primary dark:text-white font-bold mb-4">Live Terminal</h3>
                     <Terminal height="280px" />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
