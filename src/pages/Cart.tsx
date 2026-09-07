import React, {useEffect} from 'react';
import {useCart} from '../context/CartContext';

const Cart: React.FC = () => {
    const {
        cartItems,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalItems,
        totalPrice,
        products,
        loadProducts,
        loading
    } = useCart();

    useEffect(() => {
        loadProducts();
    }, []);

    const getProduct = (productId: string) => {
        return products?.find(p => p.id === productId);
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-body">Загрузка...</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto container-custom py-8">
            <h1 className="heading-1 mb-6 text-center">🛒 Корзина</h1>

            {cartItems.length === 0 ? (
                <div className="card text-center py-12 max-w-3xl mx-auto">
                    <div className="text-6xl mb-4">🛒</div>
                    <p className="text-body text-xl">Корзина пуста</p>
                    <p className="text-muted mt-2">Но это легко исправить 😉</p>
                </div>
            ) : (
                <div className="card max-w-3xl mx-auto">
                    {cartItems.map(item => {
                        const product = getProduct(item.productId);
                        if (!product) return null;

                        return (
                            <div key={item.productId}
                                 className="flex justify-between items-center border-b border-[var(--border-light)] py-3 last:border-0">
                                <div className="flex items-center gap-3 min-w-[100px]">
                                    <span className="text-3xl">{product.image || '📦'}</span>
                                    <div>
                                        <h3 className="heading-3 text-sm truncate max-w-[120px]">{product.name}</h3>
                                        <p className="text-muted text-xs">${product.price}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => decreaseQuantity(item.productId)}
                                        className="w-6 h-6 rounded-full bg-[var(--bg-primary)] border border-[var(--border-light)] text-white hover:bg-[var(--bg-card-hover)] transition flex items-center justify-center text-sm"
                                    >
                                        −
                                    </button>
                                    <span
                                        className="text-white font-medium w-5 text-center text-sm">{item.quantity}</span>
                                    <button
                                        onClick={() => increaseQuantity(item.productId)}
                                        className="w-6 h-6 rounded-full bg-[var(--bg-primary)] border border-[var(--border-light)] text-white hover:bg-[var(--bg-card-hover)] transition flex items-center justify-center text-sm"
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="flex items-center gap-3 min-w-[80px] justify-end">
                                    <span
                                        className="text-white font-bold text-sm">${product.price * item.quantity}</span>
                                    <button
                                        onClick={() => removeFromCart(item.productId)}
                                        className="text-red-500 hover:text-red-400 transition text-sm"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    <div
                        className="mt-3 pt-3 border-t border-[var(--border-light)] flex flex-wrap justify-between items-center gap-3">
                        <span className="text-muted text-sm">Всего: <span
                            className="text-white font-medium">{totalItems} шт.</span></span>
                        <span className="text-xl font-bold text-white">${totalPrice}</span>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-3">
                        <button onClick={clearCart} className="btn-secondary flex-1 text-center text-sm py-2">🗑️
                            Очистить
                        </button>
                        <button className="btn-primary flex-1 text-center text-sm py-2">Оформить заказ →</button>
                    </div>
                </div>
            )}

            <div className="text-center mt-6 text-sm text-gray-500 animate-pulse">
                ↑ Скролл вверх для возврата
            </div>
        </div>
    );
};

export default Cart;