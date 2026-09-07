import React, {useEffect, useState} from 'react';
import {BrowserRouter} from 'react-router-dom';
import AutoNav from './components/AutoNav';
import GearBackground from './components/GearBackground';
import FloatingCartBar from './components/FloatingCartBar';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import {auth} from './firebase/config';
import {getUserProfile} from './firebase/userService';
import {useSettings} from './context/SettingsContext';

function App() {
    const {settings, loading: settingsLoading} = useSettings();
    const [user, setUser] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setUser(user);
            if (user) {
                try {
                    const profile = await getUserProfile(user.uid);
                    setIsAdmin(profile?.role === 'admin');
                } catch (error) {
                    console.error('Ошибка загрузки профиля:', error);
                }
            } else {
                setIsAdmin(false);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading || settingsLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p className="text-gray-400">Загрузка...</p>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <GearBackground/>
            <AutoNav/>

            <div className="relative z-10 h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth pb-16">
                {settings.home && (
                    <section id="home" className="h-screen snap-start">
                        <Home/>
                    </section>
                )}

                {settings.catalog && (
                    <section id="catalog" className="h-screen snap-start overflow-y-auto">
                        <Catalog/>
                    </section>
                )}

                {settings.cart && (
                    <section id="cart" className="h-screen snap-start overflow-y-auto">
                        <Cart/>
                    </section>
                )}

                {user && settings.profile && (
                    <section id="profile" className="h-screen snap-start overflow-y-auto">
                        <Profile/>
                    </section>
                )}

                {isAdmin && settings.admin && (
                    <section id="admin" className="h-screen snap-start overflow-y-auto">
                        <Admin/>
                    </section>
                )}

                {!user && settings.login && (
                    <section id="login" className="h-screen snap-start overflow-y-auto">
                        <Login/>
                    </section>
                )}

                {!user && settings.register && (
                    <section id="register" className="h-screen snap-start overflow-y-auto">
                        <Register/>
                    </section>
                )}
            </div>

            {/* Плавающая панель корзины — ВСЕГДА ПОВЕРХ */}
            <FloatingCartBar/>
        </BrowserRouter>
    );
}

export default App;