
import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';

interface PanelSettings {
    title: string;
    favicon: string | null;
    logo: string | null;
    copyright: string;
}

interface SettingsContextType {
  settings: PanelSettings;
  setSettings: (settings: PanelSettings) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultSettings: PanelSettings = {
    title: 'Cyber Telegram Bot Admin Panel',
    favicon: null,
    logo: null,
    copyright: 'CyberPanel v1.0 © 2024 Your Bot'
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettingsState] = useState<PanelSettings>(() => {
        try {
            const item = window.localStorage.getItem('panelSettings');
            return item ? JSON.parse(item) : defaultSettings;
        } catch (error) {
            console.error(error);
            return defaultSettings;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem('panelSettings', JSON.stringify(settings));
        } catch (error) {
            console.error(error);
        }
    }, [settings]);
    
    const setSettings = (newSettings: PanelSettings) => {
        setSettingsState(newSettings);
    };

    const value = useMemo(() => ({ settings, setSettings }), [settings]);

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
