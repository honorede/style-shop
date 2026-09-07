import {useEffect, useState} from 'react';

const SESSION_KEY = 'shop_session_id';

// Генерация уникального ID
const generateSessionId = (): string => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const useSession = () => {
    const [sessionId, setSessionId] = useState<string>('');

    useEffect(() => {
        let id = localStorage.getItem(SESSION_KEY);
        if (!id) {
            id = generateSessionId();
            localStorage.setItem(SESSION_KEY, id);
        }
        setSessionId(id);
    }, []);

    return sessionId;
};