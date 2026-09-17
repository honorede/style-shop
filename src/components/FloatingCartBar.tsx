// src/components/FloatingCartBar.tsx
import React from 'react';
import {useLocation} from 'react-router-dom';
import {useCart} from '../context/CartContext';

const FloatingCartBar: React.FC = () => {
    const location = useLocation();
    const {cartItems, subtotal} = useCart();

    // Скрываем на страницах оформления заказа
    const hiddenPaths = ['/checkout', '/order-success'];
    if (hiddenPaths.includes(location.pathname)) {
        return null;
    }

    if (cartItems.length === 0) {
        return null;
    }

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Функция прокрутки к секции корзины
    const scrollToCart = () => {
        const cartSection = document.getElementById('cart');
        if (cartSection) {
            cartSection.scrollIntoView({behavior: 'smooth'});
        } else {
            // Если секция не найдена — переходим на главную с якорем
            window.location.href = '/#cart';
        }
    };

    return (
        <button
            onClick={scrollToCart}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50
                 bg-gradient-to-r from-blue-600 to-purple-600
                 hover:from-blue-700 hover:to-purple-700
                 text-white px-6 py-3 rounded-2xl shadow-2xl
                 transition-all duration-300 hover:scale-105
                 flex items-center gap-4 backdrop-blur-sm
                 cursor-pointer border-none"
        >
      <span className="flex items-center gap-2">
        <span className="text-lg">🛒</span>
        <span className="font-bold">{totalItems}</span>
      </span>
            <span className="w-px h-6 bg-white/30"/>
            <span className="font-semibold">{subtotal} ₽</span>
            <span className="w-px h-6 bg-white/30"/>
            <span className="text-sm opacity-80">Перейти в корзину →</span>
        </button>
    );
};

export default FloatingCartBar;