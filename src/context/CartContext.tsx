import React, {createContext, ReactNode, useContext, useEffect, useMemo, useState} from 'react';
import {
    addProduct as addProductToDB,
    type CartItem,
    deleteProduct as deleteProductFromDB,
    getCart,
    getProducts,
    type Product,
    saveCart,
    updateProduct as updateProductInDB
} from '../firebase/services';
import {useSession} from '../hooks/useSession';

interface CartContextType {
    // Корзина
    cartItems: CartItem[];
    addToCart: (productId: string) => void;
    removeFromCart: (productId: string) => void;
    increaseQuantity: (productId: string) => void;
    decreaseQuantity: (productId: string) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    loadCart: () => Promise<void>;

    // Товары
    products: Product[];
    loadProducts: () => Promise<void>;
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;

    // Загрузка
    loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const sessionId = useSession();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Загрузка корзины из Firebase
    const loadCart = async () => {
        if (!sessionId) return;
        try {
            const items = await getCart(sessionId);
            setCartItems(items);
        } catch (error) {
            console.error('Ошибка загрузки корзины:', error);
        }
    };

    // Сохранение корзины в Firebase
    const persistCart = async (items: CartItem[]) => {
        if (!sessionId) return;
        try {
            await saveCart(sessionId, items);
        } catch (error) {
            console.error('Ошибка сохранения корзины:', error);
        }
    };

    // Загрузка товаров из Firebase
    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
        } finally {
            setLoading(false);
        }
    };

    // Добавить товар в корзину
    const addToCart = (productId: string) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.productId === productId);
            let newItems;
            if (existing) {
                newItems = prev.map(item =>
                    item.productId === productId
                        ? {...item, quantity: item.quantity + 1}
                        : item
                );
            } else {
                newItems = [...prev, {productId, quantity: 1}];
            }
            persistCart(newItems);
            return newItems;
        });
    };

    // Удалить товар из корзины
    const removeFromCart = (productId: string) => {
        setCartItems(prev => {
            const newItems = prev.filter(item => item.productId !== productId);
            persistCart(newItems);
            return newItems;
        });
    };

    // Увеличить количество
    const increaseQuantity = (productId: string) => {
        setCartItems(prev => {
            const newItems = prev.map(item =>
                item.productId === productId
                    ? {...item, quantity: item.quantity + 1}
                    : item
            );
            persistCart(newItems);
            return newItems;
        });
    };

    // Уменьшить количество
    const decreaseQuantity = (productId: string) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.productId === productId);
            if (existing && existing.quantity <= 1) {
                const newItems = prev.filter(item => item.productId !== productId);
                persistCart(newItems);
                return newItems;
            }
            const newItems = prev.map(item =>
                item.productId === productId
                    ? {...item, quantity: item.quantity - 1}
                    : item
            );
            persistCart(newItems);
            return newItems;
        });
    };

    const clearCart = () => {
        setCartItems([]);
        persistCart([]);
    };

    // CRUD для товаров
    const addProduct = async (product: Omit<Product, 'id'>) => {
        await addProductToDB(product);
        await loadProducts();
    };

    const updateProduct = async (id: string, data: Partial<Product>) => {
        await updateProductInDB(id, data);
        await loadProducts();
    };

    const deleteProduct = async (id: string) => {
        await deleteProductFromDB(id);
        await loadProducts();
    };

    // Подсчёты
    const totalItems = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }, [cartItems]);

    const totalPrice = useMemo(() => {
        return cartItems.reduce((sum, item) => {
            const product = products.find(p => p.id === item.productId);
            return sum + (product ? product.price * item.quantity : 0);
        }, 0);
    }, [cartItems, products]);

    // Загрузка при старте
    useEffect(() => {
        if (sessionId) {
            loadCart();
            loadProducts();
        }
    }, [sessionId]);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            increaseQuantity,
            decreaseQuantity,
            clearCart,
            totalItems,
            totalPrice,
            loadCart,
            products,
            loadProducts,
            addProduct,
            updateProduct,
            deleteProduct,
            loading,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};