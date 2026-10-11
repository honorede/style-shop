import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';

// ТВОЙ КОНФИГ ИЗ FIREBASE CONSOLE
const firebaseConfig = {
    apiKey: "показать не могу",
    authDomain: "показать не могу",
    projectId: "показать не могу",
    storageBucket: "показать не могу",
    messagingSenderId: "показать не могу",
    appId: "показать не могу",
    measurementId: "показать не могу"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Экспорт сервисов
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
