import React from 'react';
import {motion} from 'framer-motion';

const Home: React.FC = () => {
    const containerVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: {opacity: 0, y: 30},
        visible: {
            opacity: 1,
            y: 0,
            transition: {duration: 0.6, ease: 'easeOut'},
        },
    };

    // Функция для скролла к каталогу
    const scrollToCatalog = () => {
        document.getElementById('catalog')?.scrollIntoView({behavior: 'smooth'});
    };

    // Функция для скролла к корзине
    const scrollToCart = () => {
        document.getElementById('cart')?.scrollIntoView({behavior: 'smooth'});
    };

    return (
        <div className="h-full flex items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"/>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"/>
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-2xl"/>
            </div>

            <motion.div
                className="text-center max-w-4xl"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="mb-6">
                    <div className="text-8xl md:text-9xl animate-pulse-slow">🛒</div>
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight"
                >
                    Добро пожаловать в
                    <span className="text-gradient block mt-2">StyleShop</span>
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed mb-10"
                >
                    Современный магазин с минималистичным дизайном.
                    Наслаждайтесь шопингом в атмосфере стиля и комфорта.
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
                    <button
                        onClick={scrollToCatalog}
                        className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
                    >
                        Начать покупки ↓
                    </button>
                    <button
                        onClick={scrollToCart}
                        className="px-8 py-4 bg-[#1a1a1a] text-white font-semibold rounded-xl border border-[#333] hover:bg-[#222] hover:border-[#555] transition-all duration-300"
                    >
                        Корзина 🛒
                    </button>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="mt-12 flex flex-wrap justify-center gap-6 md:gap-10 text-sm text-[var(--text-muted)]"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-green-400 text-lg">✦</span> Бесплатная доставка
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-blue-400 text-lg">✦</span> Гарантия качества
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-purple-400 text-lg">✦</span> Поддержка 24/7
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-16">
                    <button
                        onClick={scrollToCatalog}
                        className="inline-block animate-bounce text-[var(--text-muted)] hover:text-white transition-colors duration-300 cursor-pointer"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                        </svg>
                    </button>
                </motion.div>

                <div className="mt-8 text-sm text-gray-500 animate-pulse">
                    ↓ Скролл вниз для каталога
                </div>
            </motion.div>
        </div>
    );
};

export default Home;