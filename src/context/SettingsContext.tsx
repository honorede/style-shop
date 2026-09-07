import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {getNavigationSettings, type NavigationSettings, updateNavigationSettings} from '../firebase/settingsService';

interface SettingsContextType {
    settings: NavigationSettings;
    updateSettings: (newSettings: Partial<NavigationSettings>) => Promise<void>;
    loading: boolean;
    refresh: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [settings, setSettings] = useState<NavigationSettings>({
        home: true,
        catalog: true,
        cart: true,
        profile: true,
        admin: true,
        login: true,
        register: true,
    });
    const [loading, setLoading] = useState(true);

    const loadSettings = async () => {
        try {
            const data = await getNavigationSettings();
            setSettings(data);
        } catch (error) {
            console.error('Ошибка загрузки настроек:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async (newSettings: Partial<NavigationSettings>) => {
        try {
            await updateNavigationSettings(newSettings);
            setSettings(prev => ({...prev, ...newSettings}));
        } catch (error) {
            console.error('Ошибка обновления настроек:', error);
            throw error;
        }
    };

    const refresh = async () => {
        setLoading(true);
        await loadSettings();
    };

    useEffect(() => {
        loadSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{settings, updateSettings, loading, refresh}}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};