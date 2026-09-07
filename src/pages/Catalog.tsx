import React, {useEffect, useState} from 'react';
import {useCart} from '../context/CartContext';
import {useViewMode} from '../hooks/useViewMode';
import {useInView} from 'react-intersection-observer';

const Catalog: React.FC = () => {
    const {products, loadProducts, addToCart, loading} = useCart();
    const {viewMode} = useViewMode();
    const [visibleCount, setVisibleCount] = useState(6);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const visibleProducts = products?.slice(0, visibleCount) || [];
    const hasMore = products && visibleCount < products.length;

    const {ref, inView} = useInView({
        threshold: 0.1,
        triggerOnce: false,
    });

    useEffect(() => {
        if (inView && hasMore && !isLoadingMore) {
            setIsLoadingMore(true);
            setTimeout(() => {
                setVisibleCount(prev => Math.min(prev + 6, products?.length || 0));
                setIsLoadingMore(false);
            }, 400);
        }
    }, [inView, hasMore, products]);

    if (loading) {
        return (
            <div className="container-custom py-8">
                <h1 className="heading-1 mb-8">🛍️ Каталог</h1>
                <div className="text-center py-12">
                    <p className="text-body">Загрузка товаров...</p>
                </div>
            </div>
        );
    }

    return (
        <div id="catalog-section" className="container-custom py-8 animate-fade-in pb-24">
            <div className="flex flex-wrap justify-between items-center mb-8">
                <h1 className="heading-1">🛍️ Каталог</h1>

                <div className="hidden sm:flex items-center gap-2 bg-[#1a1a1a] rounded-xl p-1 border border-[#2a2a2a]">
                    <button
                        onClick={() => localStorage.setItem('shop_view_mode', 'grid')}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-300 flex items-center gap-1.5 ${
                            viewMode === 'grid' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
                            <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
                            <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
                            <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
                        </svg>
                        Сетка
                    </button>
                    <button
                        onClick={() => localStorage.setItem('shop_view_mode', 'list')}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-300 flex items-center gap-1.5 ${
                            viewMode === 'list' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <line x1="4" y1="6" x2="20" y2="6" strokeWidth="2" strokeLinecap="round"/>
                            <line x1="4" y1="12" x2="20" y2="12" strokeWidth="2" strokeLinecap="round"/>
                            <line x1="4" y1="18" x2="20" y2="18" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        Список
                    </button>
                </div>
            </div>

            {!products || products.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-body text-xl">Товаров пока нет</p>
                    <p className="text-muted mt-2">Добавьте их через админку</p>
                </div>
            ) : (
                <>
                    <div className={
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'
                            : 'flex flex-col gap-4'
                    }>
                        {visibleProducts.map((product) => (
                            <div
                                key={product.id}
                                className={
                                    viewMode === 'grid'
                                        ? 'card text-center hover:-translate-y-2 transition-all duration-300 flex flex-col'
                                        : 'card flex flex-col sm:flex-row items-center gap-4 p-4 hover:border-[#444] transition-all duration-300'
                                }
                            >
                                <div className={viewMode === 'grid' ? 'text-7xl mb-3' : 'text-5xl flex-shrink-0'}>
                                    {product.image || '📦'}
                                </div>

                                <div className={viewMode === 'grid' ? '' : 'flex-1 w-full sm:w-auto'}>
                                    <h2 className={viewMode === 'grid' ? 'heading-3' : 'heading-3 text-center sm:text-left'}>
                                        {product.name}
                                    </h2>

                                    {viewMode === 'list' && product.description && (
                                        <p className="text-sm text-gray-400 mt-1 line-clamp-2 text-center sm:text-left">
                                            {product.description}
                                        </p>
                                    )}

                                    <p className="text-2xl font-bold text-[var(--text-primary)] mt-2">
                                        ${product.price}
                                    </p>
                                    <p className="text-muted text-sm mt-1">
                                        {product.inStock ? '✅ В наличии' : '❌ Нет в наличии'}
                                    </p>
                                </div>

                                <button
                                    onClick={() => product.id && addToCart(product.id)}
                                    disabled={!product.inStock}
                                    className={`${
                                        viewMode === 'grid'
                                            ? 'btn-primary btn-full mt-auto'
                                            : 'px-6 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition flex-shrink-0 w-full sm:w-auto'
                                    } ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {product.inStock ? 'В корзину 🛒' : 'Нет в наличии'}
                                </button>
                            </div>
                        ))}
                    </div>

                    {hasMore && (
                        <div ref={ref} className="text-center py-8">
                            {isLoadingMore ? (
                                <div className="flex items-center justify-center gap-3 text-gray-400">
                                    <span
                                        className="animate-spin inline-block w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full"/>
                                    Загрузка товаров...
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm animate-pulse">
                                    Прокрутите вниз для загрузки ещё товаров
                                </p>
                            )}
                        </div>
                    )}

                    <div className="text-center mt-4 text-sm text-gray-500">
                        Показано {visibleProducts.length} из {products.length} товаров
                    </div>
                </>
            )}
        </div>
    );
};

export default Catalog;