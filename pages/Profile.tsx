import React, { useState, useEffect, useRef } from 'react';
import { mockProfile } from '../mockApi';
import { AdminUser } from '../types';
import { CameraIcon } from '../components/Icons';

const Profile: React.FC = () => {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        mockProfile().then(data => {
            setUser(data);
            setUsername(data.username);
            setAvatar(data.avatar);
        });
    }, []);
    
    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Profile saved! (mock action)');
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setAvatar(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    if (!user) {
        return <div>Loading profile...</div>;
    }

    return (
        <div className="animate-fade-in space-y-8 max-w-4xl mx-auto">
            <div className="bg-light-surface dark:bg-cyber-surface p-6 rounded-lg border border-light-border dark:border-cyber-border shadow-light-panel dark:shadow-cyber-panel">
                <h3 className="text-xl font-display font-bold mb-6">Your Profile</h3>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <img src={avatar} alt="Profile" className="h-24 w-24 rounded-full object-cover border-4 border-light-primary/20 dark:border-cyber-primary/20"/>
                            <button 
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 bg-light-surface dark:bg-cyber-surface rounded-full p-1 border border-light-border dark:border-cyber-border hover:bg-gray-100 dark:hover:bg-cyber-bg"
                            >
                                <CameraIcon className="h-5 w-5 text-light-primary dark:text-cyber-primary"/>
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="username" className="block text-sm font-medium text-light-text-secondary dark:text-gray-400">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mt-1 block w-full bg-light-bg dark:bg-cyber-bg border border-light-border dark:border-cyber-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-cyber-primary transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-light-border dark:border-cyber-border/20">
                        <h4 className="font-display text-lg mb-4">Change Password</h4>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="current-password">Current Password</label>
                                <input type="password" id="current-password" placeholder="••••••••" className="mt-1 block w-full bg-light-bg dark:bg-cyber-bg border border-light-border dark:border-cyber-border rounded-md p-2"/>
                            </div>
                            <div>
                                <label htmlFor="new-password">New Password</label>
                                <input type="password" id="new-password" placeholder="••••••••" className="mt-1 block w-full bg-light-bg dark:bg-cyber-bg border border-light-border dark:border-cyber-border rounded-md p-2"/>
                            </div>
                             <div>
                                <label htmlFor="confirm-password">Confirm New Password</label>
                                <input type="password" id="confirm-password" placeholder="••••••••" className="mt-1 block w-full bg-light-bg dark:bg-cyber-bg border border-light-border dark:border-cyber-border rounded-md p-2"/>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6">
                         <button 
                            type="submit"
                            className="px-6 py-2 bg-light-primary dark:bg-cyber-primary text-white dark:text-cyber-bg font-bold rounded-md hover:opacity-90 dark:hover:shadow-cyber-glow transition-all duration-300"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
