import React from 'react';
import {useNavigate} from 'react-router-dom';
import {useCart} from '../context/CartContext';

const FloatingCartBar: React.FC = () => {
    const {totalItems, totalPrice} = useCart();
    const navigate = useNavigate();

    if (totalItems === 0) return null;

    const goToCart = () => {
        // Проверяем, есть ли секция корзины на текущей странице
        const el = document.getElementById('cart');
        if (el) {
            el.scrollIntoView({behavior: 'smooth'});
        } else {
            navigate('/cart');
        }
    };

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-md border-t border-[#1a1a1a] px-4 py-3">
            <div className="container mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-400 hidden sm:inline">
            Товаров: <span className="text-white font-medium">{totalItems}</span>
          </span>
                    <span className="text-gray-400">
            <span className="text-white font-bold text-lg">${totalPrice}</span>
          </span>
                </div>

                <button
                    onClick={goToCart}
                    className="px-5 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 text-sm sm:text-base"
                >
                    <span>Перейти в корзину</span>
                    <span className="bg-black/10 px-2 py-0.5 rounded-full text-xs font-bold">
            {totalItems}
          </span>
                    <span className="hidden sm:inline">🛒</span>
                </button>
            </div>
        </div>
    );
};

export default FloatingCartBar;