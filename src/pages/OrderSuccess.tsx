// src/pages/OrderSuccess.tsx
import React from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';

const OrderSuccess: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('id');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
                <div className="text-6xl mb-6">🎉</div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                    Заказ оформлен!
                </h1>
                {orderId && (
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                        Номер заказа: <span className="font-mono font-semibold">{orderId}</span>
                    </p>
                )}
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Спасибо за покупку! Мы свяжемся с вами.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
                    >
                        На главную
                    </button>
                    <button
                        onClick={() => navigate('/catalog')}
                        className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-xl transition-all"
                    >
                        В каталог
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;