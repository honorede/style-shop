// src/pages/Checkout.tsx
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useUser} from '../context/UserContext';
import {useCart} from '../context/CartContext';
import {db} from '../firebase/config';
import {addDoc, collection, serverTimestamp} from 'firebase/firestore';

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const {user} = useUser();
    const {cartItems, subtotal, sessionId, clearCart} = useCart();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        address: '',
        city: '',
        phone: '',
    });

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/cart');
        }
    }, [cartItems, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.address || !form.city || !form.phone) {
            alert('Заполните все поля!');
            return;
        }

        setLoading(true);

        try {
            const orderData = {
                userId: user?.uid || null,
                userEmail: user?.email || 'guest@example.com',
                userName: user?.displayName || 'Гость',
                items: cartItems.map((item: any) => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image || '',
                })),
                shipping: {
                    address: form.address,
                    city: form.city,
                    phone: form.phone,
                },
                subtotal: subtotal,
                delivery: subtotal > 5000 ? 0 : 300,
                total: subtotal + (subtotal > 5000 ? 0 : 300),
                status: 'pending',
                createdAt: serverTimestamp(),
                sessionId: sessionId,
            };

            const docRef = await addDoc(collection(db, 'orders'), orderData);
            console.log('✅ Заказ создан! ID:', docRef.id);

            await clearCart();
            navigate(`/order-success?id=${docRef.id}`);
        } catch (error) {
            console.error('❌ Ошибка:', error);
            alert('Ошибка при оформлении заказа. Попробуйте ещё раз.');
        } finally {
            setLoading(false);
        }
    };

    const delivery = subtotal > 5000 ? 0 : 300;
    const total = subtotal + delivery;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-32 px-4">
            <div className="container mx-auto max-w-2xl">
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors flex items-center gap-2"
                >
                    ← На главную
                </button>

                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
                    Оформление заказа
                </h1>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Город *
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Москва"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Адрес доставки *
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="ул. Пушкина, д. 10"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Телефон *
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="+7 (999) 123-45-67"
                        />
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-2">
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Товары ({cartItems.length})</span>
                            <span>{subtotal} ₽</span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                            <span>Доставка</span>
                            <span>{delivery === 0 ? 'Бесплатно' : delivery + ' ₽'}</span>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                            <div className="flex justify-between text-xl font-bold text-gray-800 dark:text-white">
                                <span>Итого</span>
                                <span>{total} ₽</span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Оформляем...' : 'Оформить заказ'}
                    </button>

                    {subtotal > 5000 && (
                        <p className="text-sm text-green-600 dark:text-green-400 text-center">
                            🎉 Бесплатная доставка!
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Checkout;