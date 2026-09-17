// src/context/UserContext.tsx
import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {auth} from '../firebase/config';
import {onAuthStateChanged} from 'firebase/auth';

interface UserContextType {
    user: any | null;
    loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{user, loading}}>
            {children}
        </UserContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a UserProvider');
    }
    return context;
};

export const useUser = useAuth;