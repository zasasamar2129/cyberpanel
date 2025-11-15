import React, { useState, useEffect, useMemo } from 'react';
import { AdminUser } from '../types';
import { mockAdminUsers } from '../mockApi';
import { PencilIcon, UserPlusIcon, SearchIcon, XIcon } from '../components/Icons';
import { faker } from '@faker-js/faker';

const AddAdminModal: React.FC<{ onClose: () => void; onSave: (newUser: Omit<AdminUser, 'id' | 'avatar' | 'lastLogin'>) => void; }> = ({ onClose, onSave }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'admin' | 'moderator'>('moderator');
    
    const handleSave = () => {
        if (username.trim() && password.trim()) {
            onSave({ username, role });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-light-surface dark:bg-cyber-surface w-full max-w-md p-6 rounded-lg border border-light-border dark:border-cyber-border shadow-light-panel dark:shadow-cyber-panel">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-display font-bold">Add New Admin</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-cyber-bg"><XIcon className="h-5 w-5"/></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-light-text-secondary dark:text-gray-400 mb-1">Username</label>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-light-bg dark:bg-cyber-bg border border-light-border dark:border-cyber-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-cyber-primary"/>
                    </div>
                    <div>
                        <label className="block text-sm text-light-text-secondary dark:text-gray-400 mb-1">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-light-bg dark:bg-cyber-bg border border-light-border dark:border-cyber-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-cyber-primary"/>
                    </div>
                    <div>
                        <label className="block text-sm text-light-text-secondary dark:text-gray-400 mb-1">Role</label>
                        <select value={role} onChange={e => setRole(e.target.value as 'admin' | 'moderator')} className="w-full bg-light-bg dark:bg-cyber-bg border border-light-border dark:border-cyber-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-cyber-primary">
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                        </select>
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

const Admins: React.FC = () => {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        mockAdminUsers().then(setAdmins);
    }, []);

    const filteredAdmins = useMemo(() => {
        return admins.filter(admin =>
            admin.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [admins, searchTerm]);

    const handleSaveNewAdmin = (newAdminData: Omit<AdminUser, 'id' | 'avatar' | 'lastLogin'>) => {
        const newAdmin: AdminUser = {
            ...newAdminData,
            id: Math.max(...admins.map(a => a.id)) + 1,
            avatar: faker.image.avatarGitHub(),
            lastLogin: new Date().toISOString(),
        };
        setAdmins(prevAdmins => [...prevAdmins, newAdmin]);
        setIsAddModalOpen(false);
    };

    return (
        <>
            {isAddModalOpen && <AddAdminModal onClose={() => setIsAddModalOpen(false)} onSave={handleSaveNewAdmin} />}
            <div className="animate-fade-in bg-light-surface dark:bg-cyber-surface p-6 rounded-lg border border-light-border dark:border-cyber-border shadow-light-panel dark:shadow-cyber-panel">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h3 className="text-xl font-display font-bold">Admin Accounts</h3>
                    <div className="flex items-center gap-4">
                        <div className="relative w-full md:w-auto">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-light-text-secondary dark:text-cyber-primary/50" />
                            <input
                                type="text"
                                placeholder="Search admins..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-light-bg dark:bg-cyber-bg border border-light-border dark:border-cyber-border rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-cyber-primary transition-all"
                            />
                        </div>
                        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center space-x-2 px-4 py-2 bg-light-primary/10 text-light-primary dark:bg-cyber-primary/10 dark:text-cyber-primary rounded-lg hover:bg-light-primary/20 dark:hover:bg-cyber-primary/20 transition-colors">
                            <UserPlusIcon className="h-5 w-5" />
                            <span className="hidden sm:inline">Add Admin</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-light-border dark:border-cyber-border text-sm uppercase text-light-text-secondary dark:text-gray-400">
                            <tr>
                                <th className="p-3">Avatar</th>
                                <th className="p-3">Username</th>
                                <th className="p-3">Role</th>
                                <th className="p-3 hidden md:table-cell">Last Login</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-light-border dark:divide-cyber-border/20">
                            {filteredAdmins.map(admin => (
                                <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-cyber-primary/5 transition-colors">
                                    <td className="p-3">
                                        <img src={admin.avatar} alt={admin.username} className="h-10 w-10 rounded-full border-2 border-light-primary/20 dark:border-cyber-primary/20" />
                                    </td>
                                    <td className="p-3 font-bold text-light-text-primary dark:text-white">{admin.username}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${admin.role === 'admin' 
                                            ? 'bg-red-500/20 text-red-400' 
                                            : 'bg-sky-500/20 text-sky-400'}`
                                        }>
                                            {admin.role}
                                        </span>
                                    </td>
                                    <td className="p-3 hidden md:table-cell text-light-text-secondary dark:text-gray-400">{new Date(admin.lastLogin).toLocaleString()}</td>
                                    <td className="p-3 flex justify-center items-center space-x-2 h-[66px]">
                                        <button className="p-2 rounded-full hover:bg-blue-500/10 text-blue-500 transition-colors">
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

export default Admins;