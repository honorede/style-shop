import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import {SettingsProvider} from './context/SettingsContext';
import {UserProvider} from './context/UserContext';
import {CartProvider} from './context/CartContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <SettingsProvider>
            <UserProvider>
                <CartProvider>
                    <App/>
                </CartProvider>
            </UserProvider>
        </SettingsProvider>
    </React.StrictMode>
);