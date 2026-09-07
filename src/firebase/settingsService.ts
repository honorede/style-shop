import {db} from './config';
import {doc, getDoc, setDoc, updateDoc} from 'firebase/firestore';

// ЭКСПОРТИРУЕМ ИНТЕРФЕЙС
export interface NavigationSettings {
    home: boolean;
    catalog: boolean;
    cart: boolean;
    profile: boolean;
    admin: boolean;
    login: boolean;
    register: boolean;
}

const DEFAULT_SETTINGS: NavigationSettings = {
    home: true,
    catalog: true,
    cart: true,
    profile: true,
    admin: true,
    login: true,
    register: true,
};

// Получить настройки навигации
export const getNavigationSettings = async (): Promise<NavigationSettings> => {
    try {
        const docRef = doc(db, 'settings', 'navigation');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {...DEFAULT_SETTINGS, ...data};
        } else {
            await setDoc(docRef, DEFAULT_SETTINGS);
            return DEFAULT_SETTINGS;
        }
    } catch (error) {
        console.error('Ошибка загрузки настроек:', error);
        return DEFAULT_SETTINGS;
    }
};

// Обновить настройки
export const updateNavigationSettings = async (
    settings: Partial<NavigationSettings>
): Promise<void> => {
    try {
        const docRef = doc(db, 'settings', 'navigation');
        await updateDoc(docRef, settings);
    } catch (error) {
        console.error('Ошибка обновления настроек:', error);
        throw error;
    }
};

// Сбросить настройки по умолчанию
export const resetNavigationSettings = async (): Promise<void> => {
    try {
        const docRef = doc(db, 'settings', 'navigation');
        await setDoc(docRef, DEFAULT_SETTINGS);
    } catch (error) {
        console.error('Ошибка сброса настроек:', error);
        throw error;
    }
};