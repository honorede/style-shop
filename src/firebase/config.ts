import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';

// ТВОЙ КОНФИГ ИЗ FIREBASE CONSOLE
const firebaseConfig = {
    apiKey: "AIzaSyCGrRY-AZ86XWzd3NW00w3Qmzgbxqrwy2U",
    authDomain: "the-shop-3e884.firebaseapp.com",
    projectId: "the-shop-3e884",
    storageBucket: "the-shop-3e884.firebasestorage.app",
    messagingSenderId: "280615723199",
    appId: "1:280615723199:web:e6528ab912fdffb1a7660a",
    measurementId: "G-6S9B99KXRY"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Экспорт сервисов
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;