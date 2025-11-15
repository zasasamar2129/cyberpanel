import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { UploadIcon } from '../components/Icons';

const Toggle: React.FC<{ label: string; enabled: boolean; setEnabled: (enabled: boolean) => void }> = ({ label, enabled, setEnabled }) => {
    const { theme } = useTheme();
    const activeBg = theme === 'dark' ? 'bg-cyber-primary' : 'bg-light-primary';
    const inactiveBg = theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300';

    return (
        <div className="flex items-center justify-between">
            <span className="text-light-text-primary dark:text-gray-300">{label}</span>
            <button
                onClick={() => setEnabled(!enabled)}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? activeBg : inactiveBg}`}
            >
                <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
                />
            </button>
        </div>
    );
};

const FileInput: React.FC<{ label: string; file: string | null; onFileChange: (fileDataUrl: string) => void }> = ({ label, file, onFileChange }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                onFileChange(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <div className="flex items-center justify-between">
            <label className="text-light-text-primary dark:text-gray-300">{label}</label>
            <div className="flex items-center gap-4">
                {file && <img src={file} alt={`${label} preview`} className="h-8 w-8 object-contain"/>}
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-light-bg dark:bg-cyber-bg border border-light-border dark:border-cyber-border rounded-md hover:bg-gray-200 dark:hover:bg-cyber-surface"
                >
                    <UploadIcon className="h-4 w-4" />
                    Upload
                </button>
                <input type="file" ref={inputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>
        </div>
    )
}

const Settings: React.FC = () => {
    const { settings, setSettings } = useSettings();
    const [maintenance, setMaintenance] = useState(false);
    const [language, setLanguage] = useState('en');
    const [config, setConfig] = useState(`# Bot Configuration
BOT_TOKEN=your_secret_token
API_URL=https://api.telegram.org
DEBUG=false
`);
    
    // Local state for form edits
    const [formState, setFormState] = useState(settings);

    useEffect(() => {
        setFormState(settings);
    }, [settings]);

    const handleSave = () => {
        setSettings(formState);
        alert("Settings saved! (This is a mock action)");
    };
    
    const handleFileUpdate = (key: 'logo' | 'favicon', value: string) => {
        setFormState(prev => ({...prev, [key]: value}));
    }

    return (
        <div className="animate-fade-in space-y-8">
            <div className="bg-light-surface dark:bg-cyber-surface p-6 rounded-lg border border-light-border dark:border-cyber-border shadow-light-panel dark:shadow-cyber-panel">
                <h3 className="text-xl font-display font-bold mb-4 text-light-text-primary dark:text-white">Bot Controls</h3>
                <div className="space-y-4">
                    <Toggle label="Maintenance Mode" enabled={maintenance} setEnabled={setMaintenance} />
                    <div className="flex items-center justify-between">
                        <label htmlFor="language" className="text-light-text-primary dark:text-gray-300">Default Language</label>
                        <select
                            id="language"
                            value={language}
                            onChange={e => setLanguage(e.target.value)}
                            className="bg-light-bg dark:bg-cyber-bg border border-light-border dark:border-cyber-border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-cyber-primary transition-all"
                        >
                            <option value="en">English</option>
                            <option value="fa">Farsi</option>
                            <option value="in">Hindi</option>
                            <option value="ar">Arabic</option>
                            <option value="ru">Russian</option>
                            <option value="es">Spanish</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-light-surface dark:bg-cyber-surface p-6 rounded-lg border border-light-border dark:border-cyber-border shadow-light-panel dark:shadow-cyber-panel">
                <h3 className="text-xl font-display font-bold mb-4 text-light-text-primary dark:text-white">Panel Customization</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label htmlFor="panel-title" className="text-light-text-primary dark:text-gray-300">Panel Title</label>
                        <input
                            type="text"
                            id="panel-title"
                            value={formState.title}
                            onChange={e => setFormState(prev => ({...prev, title: e.target.value}))}
                            className="w-1/2 bg-light-bg dark:bg-cyber-bg border border-light-border dark:border-cyber-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-cyber-primary"
                        />
                    </div>
                    <FileInput label="Logo" file={formState.logo} onFileChange={(data) => handleFileUpdate('logo', data)} />
                    <FileInput label="Favicon" file={formState.favicon} onFileChange={(data) => handleFileUpdate('favicon', data)} />
                     <div className="flex items-center justify-between">
                        <label htmlFor="copyright" className="text-light-text-primary dark:text-gray-300">Copyright Text</label>
                        <input
                            type="text"
                            id="copyright"
                            value={formState.copyright}
                            onChange={e => setFormState(prev => ({...prev, copyright: e.target.value}))}
                            className="w-1/2 bg-light-bg dark:bg-cyber-bg border border-light-border dark:border-cyber-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-cyber-primary"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-light-surface dark:bg-cyber-surface p-6 rounded-lg border border-light-border dark:border-cyber-border shadow-light-panel dark:shadow-cyber-panel">
                <h3 className="text-xl font-display font-bold mb-4 text-light-text-primary dark:text-white">Edit config.env</h3>
                <textarea
                    value={config}
                    onChange={e => setConfig(e.target.value)}
                    className="w-full h-64 p-4 font-mono text-sm bg-light-bg dark:bg-cyber-bg border border-light-border dark:border-cyber-border text-green-600 dark:text-green-400 rounded-md focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-cyber-primary transition-all"
                    spellCheck="false"
                />
            </div>
            
            <div className="flex justify-end">
                <button 
                    onClick={handleSave}
                    className="px-6 py-2 bg-light-primary dark:bg-cyber-primary text-white dark:text-cyber-bg font-bold rounded-md hover:opacity-90 dark:hover:shadow-cyber-glow transition-all duration-300"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default Settings;