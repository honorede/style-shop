import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {logoutUser, onAuthChange} from '../firebase/services';
import {getUserProfile, type UserProfile} from '../firebase/userService';
import {useSettings} from '../context/SettingsContext';

const AutoNav: React.FC = () => {
    const navigate = useNavigate();
    const {settings} = useSettings();

    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('home');

    // Следим за активной секцией
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        setActiveSection(id);
                    }
                });
            },
            {threshold: 0.4}
        );

        const sectionIds = ['home', 'catalog', 'cart', 'profile', 'admin', 'login', 'register'];
        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({behavior: 'smooth'});
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthChange(async (user) => {
            setUser(user);
            if (user) {
                try {
                    const profileData = await getUserProfile(user.uid);
                    setProfile(profileData);
                    setIsAdmin(profileData?.role === 'admin');
                } catch (error) {
                    console.error('Ошибка загрузки профиля:', error);
                }
            } else {
                setProfile(null);
                setIsAdmin(false);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await logoutUser();
        setDropdownOpen(false);
        navigate('/');
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.dropdown-container')) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const isPageVisible = (key: string) => {
        return settings[key as keyof typeof settings] !== false;
    };

    // Компонент кнопки с плавным подчёркиванием
    const NavButton: React.FC<{
        id: string;
        label: string;
        icon?: string;
        onClick: () => void;
        isActive: boolean;
        className?: string;
    }> = ({id, label, icon, onClick, isActive, className = ''}) => {
        return (
            <button
                onClick={onClick}
                className={`relative text-sm transition-colors duration-300 ${className} ${
                    isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
            >
        <span className="flex items-center gap-1">
          {icon && <span>{icon}</span>}
            {label}
        </span>
                {/* Плавное подчёркивание */}
                <span
                    className={`absolute -bottom-0.5 left-0 h-0.5 bg-white transition-all duration-300 ease-out ${
                        isActive ? 'w-full opacity-100' : 'w-0 opacity-0'
                    }`}
                />
            </button>
        );
    };

    return (
        <nav
            className="relative z-50 bg-[#0d0d0d]/90 backdrop-blur-sm border-b border-[#1a1a1a] text-gray-300 p-3 sticky top-0">
            <div className="container mx-auto flex justify-between items-center flex-wrap gap-2">
                {/* Логотип */}
                <button
                    onClick={() => scrollToSection('home')}
                    className="text-2xl font-bold text-white hover:text-gray-400 transition"
                >
                    ⚙️ Shop
                </button>

                <div className="flex items-center gap-4 flex-wrap">
                    {/* Главная */}
                    {isPageVisible('home') && (
                        <NavButton
                            id="home"
                            label="Главная"
                            onClick={() => scrollToSection('home')}
                            isActive={activeSection === 'home'}
                        />
                    )}

                    {/* Каталог */}
                    {isPageVisible('catalog') && (
                        <NavButton
                            id="catalog"
                            label="Каталог"
                            onClick={() => scrollToSection('catalog')}
                            isActive={activeSection === 'catalog'}
                        />
                    )}

                    {/* Корзина */}
                    {isPageVisible('cart') && (
                        <NavButton
                            id="cart"
                            label="Корзина"
                            icon="🛒"
                            onClick={() => scrollToSection('cart')}
                            isActive={activeSection === 'cart'}
                        />
                    )}

                    {/* Профиль */}
                    {user && isPageVisible('profile') && (
                        <NavButton
                            id="profile"
                            label="Профиль"
                            onClick={() => scrollToSection('profile')}
                            isActive={activeSection === 'profile'}
                        />
                    )}

                    {/* Админка */}
                    {isAdmin && isPageVisible('admin') && (
                        <NavButton
                            id="admin"
                            label="Админка"
                            icon="⚙️"
                            onClick={() => scrollToSection('admin')}
                            isActive={activeSection === 'admin'}
                            className="text-yellow-400 hover:text-yellow-300"
                        />
                    )}

                    {/* Логин и Регистрация */}
                    {!user && (
                        <>
                            {isPageVisible('login') && (
                                <NavButton
                                    id="login"
                                    label="Войти"
                                    onClick={() => scrollToSection('login')}
                                    isActive={activeSection === 'login'}
                                />
                            )}
                            {isPageVisible('register') && (
                                <NavButton
                                    id="register"
                                    label="Регистрация"
                                    onClick={() => scrollToSection('register')}
                                    isActive={activeSection === 'register'}
                                />
                            )}
                        </>
                    )}

                    {/* Блок аккаунта */}
                    <div className="relative dropdown-container">
                        {loading ? (
                            <span className="text-sm text-gray-500">Загрузка...</span>
                        ) : user ? (
                            <>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1a1a1a] hover:bg-[#2a2a2a] transition border border-[#1a1a1a] text-sm"
                                >
                                    <span>👤</span>
                                    <span className="max-w-[100px] truncate">
                    {profile?.displayName || user.email?.split('@')[0] || 'Профиль'}
                  </span>
                                    <span
                                        className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>▾</span>
                                </button>

                                {dropdownOpen && (
                                    <div
                                        className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-xl py-2 z-50">
                                        <div className="px-4 py-2 border-b border-[#2a2a2a]">
                                            <p className="text-white text-sm font-medium truncate">
                                                {profile?.displayName || user.email}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>

                                        {isPageVisible('profile') && (
                                            <button
                                                onClick={() => {
                                                    setDropdownOpen(false);
                                                    scrollToSection('profile');
                                                }}
                                                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-[#2a2a2a] transition text-sm text-gray-300 hover:text-white"
                                            >
                                                👤 Профиль
                                            </button>
                                        )}

                                        {isAdmin && isPageVisible('admin') && (
                                            <button
                                                onClick={() => {
                                                    setDropdownOpen(false);
                                                    scrollToSection('admin');
                                                }}
                                                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-[#2a2a2a] transition text-sm text-yellow-400 hover:text-yellow-300"
                                            >
                                                ⚙️ Админка
                                            </button>
                                        )}

                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-[#2a2a2a] transition text-sm text-red-400 hover:text-red-300 border-t border-[#2a2a2a] mt-1 pt-2"
                                        >
                                            🚪 Выйти
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AutoNav;