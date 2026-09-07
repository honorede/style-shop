import {db} from './config';
import {collection, doc, getDoc, getDocs, setDoc, updateDoc} from 'firebase/firestore';
import {type User} from 'firebase/auth'; // ← ДОБАВЬ `type`

export interface UserProfile {
    uid: string;
    email: string;
    displayName?: string;
    phone?: string;
    address?: string;
    role: 'user' | 'admin';
    createdAt: string;
    updatedAt?: string;
}

// Создать профиль пользователя
export const createUserProfile = async (user: User, additionalData?: Partial<UserProfile>) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        const newUser: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            role: 'user',
            createdAt: new Date().toISOString(),
            ...additionalData,
        };
        await setDoc(userRef, newUser);
    }
    return userRef;
};

// Получить профиль пользователя
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            return userSnap.data() as UserProfile;
        }
        return null;
    } catch (error) {
        console.error('Ошибка получения профиля:', error);
        return null;
    }
};

// Обновить профиль пользователя
export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            ...data,
            updatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Ошибка обновления профиля:', error);
        throw error;
    }
};

// Получить всех пользователей (для админа)
export const getAllUsers = async (): Promise<UserProfile[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        return querySnapshot.docs.map(doc => doc.data() as UserProfile);
    } catch (error) {
        console.error('Ошибка получения пользователей:', error);
        return [];
    }
};