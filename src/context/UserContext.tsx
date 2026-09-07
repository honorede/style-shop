import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {auth} from '../firebase/config';
import {type User} from 'firebase/auth'; // ← ДОБАВЬ `type`
import {getUserProfile, type UserProfile} from '../firebase/userService'; // ← ДОБАВЬ `type`

interface UserContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    isAdmin: boolean;
    refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const loadProfile = async (uid: string) => {
        try {
            const data = await getUserProfile(uid);
            setProfile(data);
        } catch (error) {
            console.error('Ошибка загрузки профиля:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setUser(user);
            if (user) {
                await loadProfile(user.uid);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const refreshProfile = async () => {
        if (user) {
            await loadProfile(user.uid);
        }
    };

    const isAdmin = profile?.role === 'admin';

    return (
        <UserContext.Provider value={{
            user,
            profile,
            loading,
            isAdmin,
            refreshProfile,
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};