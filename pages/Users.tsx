import React, { useState, useEffect, useMemo } from 'react';
import { User } from '../types';
import { mockUsers } from '../mockApi';
import { BanIcon, CheckCircleIcon, PencilIcon, SearchIcon, DownloadIcon, XIcon } from '../components/Icons';

const EditUserModal: React.FC<{ user: User | null; onClose: () => void; onSave: (user: User) => void; }> = ({ user, onClose, onSave }) => {
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');

    useEffect(() => {
        setName(user?.name || '');
        setPhone(user?.phone || '');
    }, [user]);

    if (!user) return null;

    const handleSave = () => {
        onSave({ ...user, name, phone });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-light-surface dark:bg-cyber-surface w-full max-w-md p-6 rounded-lg border border-light-border dark:border-cyber-border shadow-light-panel dark:shadow-cyber-panel">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-display font-bold">Edit User: {user.username}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-cyber-bg"><XIcon className="h-5 w-5"/></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-light-text-secondary dark:text-gray-400 mb-1">Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-light-bg dark:bg-cyber-bg border border-light-border dark:border-cyber-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-cyber-primary"/>
                    </div>
                    <div>
                        <label className="block text-sm text-light-text-secondary dark:text-gray-400 mb-1">Phone</label>
                        <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-light-bg dark:bg-cyber-bg border border-light-border dark:border-cyber-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-cyber-primary"/>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-md bg-light-primary dark:bg-cyber-primary text-white dark:text-cyber-bg font-bold hover:opacity-90 transition-opacity">Save</button>
                </div>
            </div>
        </div>
    );
};


const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'banned'>('all');

    useEffect(() => {
        mockUsers(100).then(setUsers);
    }, []);

    const filteredUsers = useMemo(() => {
        return users
            .filter(user => {
                if (filterStatus === 'active') return !user.isBanned;
                if (filterStatus === 'banned') return user.isBanned;
                return true;
            })
            .filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phone.includes(searchTerm) ||
                user.id.toString().includes(searchTerm)
            );
    }, [users, searchTerm, filterStatus]);

    const handleToggleBan = (userId: number) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, isBanned: !user.isBanned } : user
        ));
    };

    const handleSaveUser = (updatedUser: User) => {
        setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
        setEditingUser(null);
    };
    
    const downloadFile = (data: string, filename: string, type: string) => {
        const blob = new Blob([data], { type });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    const handleDownloadJson = () => {
        downloadFile(JSON.stringify(filteredUsers, null, 2), 'users.json', 'application/json');
    }
    
    const handleDownloadHtml = () => {
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>User List</title>
                <style>
                    body { font-family: sans-serif; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <h1>User List</h1>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th><th>Name</th><th>Username</th><th>Phone</th><th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredUsers.map(user => `
                            <tr>
                                <td>${user.id}</td>
                                <td>${user.name}</td>
                                <td>${user.username}</td>
                                <td>${user.phone}</td>
                                <td>${user.isBanned ? 'Banned' : 'Active'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;
        downloadFile(htmlContent, 'users.html', 'text/html');
    }

    const FilterButton: React.FC<{label: string, status: typeof filterStatus, activeStatus: typeof filterStatus, setStatus: (s: typeof filterStatus) => void}> = ({label, status, activeStatus, setStatus}) => {
      const isActive = status === activeStatus;
      return (
        <button 
            onClick={() => setStatus(status)}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
                isActive 
                ? 'bg-light-primary dark:bg-cyber-primary text-white dark:text-cyber-bg' 
                : 'bg-light-bg dark:bg-cyber-bg text-light-text-secondary dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-cyber-surface'
            }`}
        >
            {label}
        </button>
      );
    }

    return (
        <>
            <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onSave={handleSaveUser} />
            <div className="animate-fade-in bg-light-surface dark:bg-cyber-surface p-6 rounded-lg border border-light-border dark:border-cyber-border shadow-light-panel dark:shadow-cyber-panel">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h3 className="text-xl font-display font-bold">User Management</h3>
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="bg-light-bg dark:bg-cyber-bg p-1 rounded-lg flex gap-1">
                            <FilterButton label="All" status="all" activeStatus={filterStatus} setStatus={setFilterStatus} />
                            <FilterButton label="Active" status="active" activeStatus={filterStatus} setStatus={setFilterStatus} />
                            <FilterButton label="Banned" status="banned" activeStatus={filterStatus} setStatus={setFilterStatus} />
                        </div>
                        <div className="relative w-full md:w-auto">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-light-text-secondary dark:text-cyber-primary/50" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-light-bg dark:bg-cyber-bg border border-light-border dark:border-cyber-border rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-cyber-primary transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mb-4">
                    <button onClick={handleDownloadJson} className="flex items-center space-x-2 px-4 py-2 bg-light-primary/10 text-light-primary dark:bg-cyber-primary/10 dark:text-cyber-primary rounded-lg hover:bg-light-primary/20 dark:hover:bg-cyber-primary/20 transition-colors">
                        <DownloadIcon className="h-5 w-5" />
                        <span>JSON</span>
                    </button>
                    <button onClick={handleDownloadHtml} className="flex items-center space-x-2 px-4 py-2 bg-light-secondary/10 text-light-secondary dark:bg-cyber-secondary/10 dark:text-cyber-secondary rounded-lg hover:bg-light-secondary/20 dark:hover:bg-cyber-secondary/20 transition-colors">
                        <DownloadIcon className="h-5 w-5" />
                        <span>HTML</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-light-border dark:border-cyber-border text-sm uppercase text-light-text-secondary dark:text-gray-400">
                            <tr>
                                <th className="p-3">User ID</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Username</th>
                                <th className="p-3 hidden md:table-cell">Phone</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-light-border dark:divide-cyber-border/20">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-cyber-primary/5 transition-colors">
                                    <td className="p-3">{user.id}</td>
                                    <td className="p-3 font-bold text-light-text-primary dark:text-white">{user.name}</td>
                                    <td className="p-3 text-light-text-secondary dark:text-gray-400">@{user.username}</td>
                                    <td className="p-3 hidden md:table-cell text-light-text-secondary dark:text-gray-400">{user.phone}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs rounded-full ${user.isBanned ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                            {user.isBanned ? 'Banned' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="p-3 flex justify-center items-center space-x-2">
                                        <button onClick={() => handleToggleBan(user.id)} title={user.isBanned ? 'Unban User' : 'Ban User'} className={`p-2 rounded-full transition-colors ${user.isBanned ? 'hover:bg-green-500/10 text-green-500' : 'hover:bg-red-500/10 text-red-500'}`}>
                                            {user.isBanned ? <CheckCircleIcon className="h-5 w-5" /> : <BanIcon className="h-5 w-5" />}
                                        </button>
                                        <button onClick={() => setEditingUser(user)} title="Edit User" className="p-2 rounded-full hover:bg-blue-500/10 text-blue-500 transition-colors">
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Users;
