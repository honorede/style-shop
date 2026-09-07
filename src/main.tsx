import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import {CartProvider} from './context/CartContext';
import {UserProvider} from './context/UserContext';
import {SettingsProvider} from './context/SettingsContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <UserProvider>
            <CartProvider>
                <SettingsProvider>
                    <App/>
                </SettingsProvider>
            </CartProvider>
        </UserProvider>
    </React.StrictMode>
);