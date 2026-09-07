import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    type User
} from 'firebase/auth';
import {auth, db} from './config';
import {addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc} from 'firebase/firestore';

// ============ АВТОРИЗАЦИЯ ============

// Регистрация
export const registerUser = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        throw error;
    }
};

// Вход
export const loginUser = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Ошибка входа:', error);
        throw error;
    }
};

// Выход
export const logoutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Ошибка выхода:', error);
        throw error;
    }
};

// Следить за состоянием пользователя
export const onAuthChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

// Экспорт auth для других файлов
export {auth};

// ============ ТОВАРЫ ============

export interface Product {
    id?: string;
    name: string;
    price: number;
    image: string;
    description?: string;
    inStock: boolean;
}

// Добавить товар
export const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
        const docRef = await addDoc(collection(db, 'products'), product);
        return {id: docRef.id, ...product};
    } catch (error) {
        console.error('Ошибка добавления товара:', error);
        throw error;
    }
};

// Получить все товары
export const getProducts = async (): Promise<Product[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Product[];
    } catch (error) {
        console.error('Ошибка получения товаров:', error);
        return [];
    }
};

// Обновить товар
export const updateProduct = async (id: string, data: Partial<Product>) => {
    try {
        await updateDoc(doc(db, 'products', id), data);
    } catch (error) {
        console.error('Ошибка обновления товара:', error);
        throw error;
    }
};

// Удалить товар
export const deleteProduct = async (id: string) => {
    try {
        await deleteDoc(doc(db, 'products', id));
    } catch (error) {
        console.error('Ошибка удаления товара:', error);
        throw error;
    }
};

// ============ КОРЗИНА ============

export interface CartItem {
    productId: string;
    quantity: number;
}

// Сохранить корзину по sessionId
export const saveCart = async (sessionId: string, items: CartItem[]) => {
    try {
        await setDoc(doc(db, 'carts', sessionId), {
            items,
            updatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Ошибка сохранения корзины:', error);
    }
};

// Получить корзину по sessionId
export const getCart = async (sessionId: string): Promise<CartItem[]> => {
    try {
        const docSnap = await getDoc(doc(db, 'carts', sessionId));
        if (docSnap.exists()) {
            return docSnap.data().items || [];
        }
        return [];
    } catch (error) {
        console.error('Ошибка получения корзины:', error);
        return [];
    }
};