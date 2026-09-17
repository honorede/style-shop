// src/components/AutoNav.tsx
import React, {useEffect, useRef, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {useAuth} from '../context/UserContext';
import {useCart} from '../context/CartContext';
import {useSettings} from '../context/SettingsContext';

interface AutoNavProps {
    isAdmin: boolean;
}

const AutoNav: React.FC<AutoNavProps> = ({isAdmin}) => {
    const location = useLocation();
    const {user} = useAuth();
    const {settings} = useSettings();
    const {cartItems} = useCart();
    const [activeTab, setActiveTab] = useState('home');
    const [profileDropdown, setProfileDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setProfileDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const hash = location.hash.replace('#', '') || 'home';
        setActiveTab(hash);
    }, [location]);

    const scrollToSection = (sectionId: string) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({behavior: 'smooth'});
            setActiveTab(sectionId);
            window.history.pushState(null, '', `/#${sectionId}`);
        }
        setProfileDropdown(false);
    };

    const handleLogout = async () => {
        const {auth} = await import('../firebase/config');
        await auth.signOut();
        window.location.href = '/';
    };

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const isOnMainPage = location.pathname === '/';

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
            <div className="container-custom flex items-center justify-between h-16 px-4">
                <button
                    onClick={() => scrollToSection('home')}
                    className="text-xl font-bold text-white hover:text-blue-400 transition"
                >
                    🛍️ Shop
                </button>

                <div className="hidden md:flex items-center gap-4">
                    {isOnMainPage ? (
                        <>
                            {settings.home && (
                                <button
                                    onClick={() => scrollToSection('home')}
                                    className={`text-sm transition ${
                                        activeTab === 'home' ? 'text-white font-medium' : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    Главная
                                </button>
                            )}
                            {settings.catalog && (
                                <button
                                    onClick={() => scrollToSection('catalog')}
                                    className={`text-sm transition ${
                                        activeTab === 'catalog' ? 'text-white font-medium' : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    Каталог
                                </button>
                            )}
                            {settings.cart && (
                                <button
                                    onClick={() => scrollToSection('cart')}
                                    className={`text-sm transition flex items-center gap-1 ${
                                        activeTab === 'cart' ? 'text-white font-medium' : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    🛒 Корзина
                                    {totalItems > 0 && (
                                        <span
                                            className="bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                                            {totalItems}
                                        </span>
                                    )}
                                </button>
                            )}

                            {user ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setProfileDropdown(!profileDropdown)}
                                        className={`text-sm transition flex items-center gap-1 ${
                                            activeTab === 'profile' || activeTab === 'admin'
                                                ? 'text-white font-medium'
                                                : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        👤 {user.displayName || 'Профиль'}
                                        <span className="text-xs">▾</span>
                                    </button>

                                    {profileDropdown && (
                                        <div
                                            className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl overflow-hidden">
                                            {settings.profile && (
                                                <button
                                                    onClick={() => scrollToSection('profile')}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-[#2a2a2a] hover:text-white transition flex items-center gap-2"
                                                >
                                                    👤 Профиль
                                                </button>
                                            )}
                                            {/* ✅ ИСПОЛЬЗУЕМ isAdmin ИЗ ПРОПСОВ */}
                                            {isAdmin && settings.admin && (
                                                <button
                                                    onClick={() => scrollToSection('admin')}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-[#2a2a2a] hover:text-white transition flex items-center gap-2 border-t border-[#2a2a2a]"
                                                >
                                                    ⚙️ Админка
                                                </button>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-[#2a2a2a] hover:text-red-300 transition flex items-center gap-2 border-t border-[#2a2a2a]"
                                            >
                                                🚪 Выйти
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    {settings.login && (
                                        <button
                                            onClick={() => scrollToSection('login')}
                                            className={`text-sm transition ${
                                                activeTab === 'login' ? 'text-white font-medium' : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            Вход
                                        </button>
                                    )}
                                    {settings.register && (
                                        <button
                                            onClick={() => scrollToSection('register')}
                                            className={`text-sm transition ${
                                                activeTab === 'register' ? 'text-white font-medium' : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            Регистрация
                                        </button>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <Link to="/" className="text-sm text-gray-400 hover:text-white transition">
                                ← На главную
                            </Link>
                            {settings.catalog && (
                                <Link to="/#catalog" className="text-sm text-gray-400 hover:text-white transition">
                                    Каталог
                                </Link>
                            )}
                            {user && (
                                <Link to="/#profile" className="text-sm text-gray-400 hover:text-white transition">
                                    Профиль
                                </Link>
                            )}
                        </>
                    )}
                </div>

                <div className="md:hidden flex items-center gap-2">
                    {isOnMainPage ? (
                        <button
                            onClick={() => {
                                const menu = document.getElementById('mobile-menu');
                                if (menu) {
                                    menu.classList.toggle('hidden');
                                }
                            }}
                            className="text-white text-2xl"
                        >
                            ☰
                        </button>
                    ) : (
                        <Link to="/" className="text-white text-sm">
                            ←
                        </Link>
                    )}
                </div>
            </div>

            <div id="mobile-menu" className="hidden md:hidden bg-black/95 border-t border-white/5 p-4">
                <div className="flex flex-col gap-3">
                    {isOnMainPage ? (
                        <>
                            {settings.home && (
                                <button onClick={() => scrollToSection('home')}
                                        className="text-white text-left hover:text-blue-400 transition">
                                    Главная
                                </button>
                            )}
                            {settings.catalog && (
                                <button onClick={() => scrollToSection('catalog')}
                                        className="text-white text-left hover:text-blue-400 transition">
                                    Каталог
                                </button>
                            )}
                            {settings.cart && (
                                <button onClick={() => scrollToSection('cart')}
                                        className="text-white text-left hover:text-blue-400 transition flex items-center gap-2">
                                    Корзина
                                    {totalItems > 0 && (
                                        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                                            {totalItems}
                                        </span>
                                    )}
                                </button>
                            )}
                            {user ? (
                                <>
                                    {settings.profile && (
                                        <button onClick={() => scrollToSection('profile')}
                                                className="text-white text-left hover:text-blue-400 transition">
                                            👤 Профиль
                                        </button>
                                    )}
                                    {isAdmin && settings.admin && (
                                        <button onClick={() => scrollToSection('admin')}
                                                className="text-white text-left hover:text-blue-400 transition">
                                            ⚙️ Админка
                                        </button>
                                    )}
                                    <button onClick={handleLogout}
                                            className="text-red-400 text-left hover:text-red-300 transition">
                                        🚪 Выйти
                                    </button>
                                </>
                            ) : (
                                <>
                                    {settings.login && (
                                        <button onClick={() => scrollToSection('login')}
                                                className="text-white text-left hover:text-blue-400 transition">
                                            Вход
                                        </button>
                                    )}
                                    {settings.register && (
                                        <button onClick={() => scrollToSection('register')}
                                                className="text-white text-left hover:text-blue-400 transition">
                                            Регистрация
                                        </button>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <Link to="/" className="text-white hover:text-blue-400 transition">
                                ← На главную
                            </Link>
                            <Link to="/#catalog" className="text-white hover:text-blue-400 transition">
                                Каталог
                            </Link>
                            {user && (
                                <Link to="/#profile" className="text-white hover:text-blue-400 transition">
                                    Профиль
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default AutoNav;