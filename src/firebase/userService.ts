// src/firebase/userService.ts
import {collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where} from 'firebase/firestore';
import {db} from './config';

// Получить профиль пользователя по uid (ищет по полю uid, если ID не совпадает)
export const getUserProfile = async (uid: string) => {
    try {
        // Способ 1: пробуем найти по ID документа
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }

        // Способ 2: если не нашли — ищем по полю uid
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('uid', '==', uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].data();
        }

        return null;
    } catch (error) {
        console.error('Ошибка получения профиля:', error);
        return null;
    }
};

// Создать профиль пользователя
export const createUserProfile = async (uid: string, data: any) => {
    try {
        const docRef = doc(db, 'users', uid);
        await setDoc(docRef, {...data, uid}, {merge: true});
        return true;
    } catch (error) {
        console.error('Ошибка создания профиля:', error);
        return false;
    }
};

// Обновить профиль пользователя
export const updateUserProfile = async (uid: string, data: any) => {
    try {
        const docRef = doc(db, 'users', uid);
        await updateDoc(docRef, data);
        return true;
    } catch (error) {
        console.error('Ошибка обновления профиля:', error);
        return false;
    }
};

// Получить всех пользователей (для админки)
export const getAllUsers = async () => {
    try {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);
        const users: any[] = [];
        snapshot.forEach((doc) => {
            users.push({
                uid: doc.id,
                ...doc.data()
            });
        });
        return users;
    } catch (error) {
        console.error('Ошибка получения всех пользователей:', error);
        return [];
    }
};

// Обновить роль пользователя
export const updateUserRole = async (uid: string, role: string) => {
    try {
        const docRef = doc(db, 'users', uid);
        await updateDoc(docRef, {role});
        return true;
    } catch (error) {
        console.error('Ошибка обновления роли:', error);
        return false;
    }
};