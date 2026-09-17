import React, {useEffect, useState} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
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
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import {auth} from './firebase/config';
import {getUserProfile} from './firebase/userService';
import {useSettings} from './context/SettingsContext';

function App() {
    const {settings, loading: settingsLoading} = useSettings();
    const [user, setUser] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profileChecked, setProfileChecked] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setUser(user);
            if (user) {
                try {
                    const profile = await getUserProfile(user.uid);
                    console.log('📄 Профиль из Firestore:', profile);
                    if (profile) {
                        setIsAdmin(profile.role === 'admin');
                        console.log('✅ Роль пользователя:', profile.role);
                    } else {
                        console.log('⚠️ Профиль не найден, создаём...');
                        const {createUserProfile} = await import('./firebase/userService');
                        await createUserProfile(user.uid, {
                            email: user.email,
                            displayName: user.displayName || 'User',
                            role: 'user',
                            phone: '',
                            address: ''
                        });
                        setIsAdmin(false);
                    }
                } catch (error) {
                    console.error('Ошибка загрузки профиля:', error);
                    setIsAdmin(false);
                }
            } else {
                setIsAdmin(false);
            }
            setProfileChecked(true);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading || settingsLoading || !profileChecked) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p className="text-gray-400">Загрузка...</p>
            </div>
        );
    }

    console.log('🔑 Текущий пользователь:', user?.uid);
    console.log('👑 isAdmin:', isAdmin);

    return (
        <BrowserRouter>
            <GearBackground/>
            <AutoNav isAdmin={isAdmin}/> {/* ← передаём isAdmin */}

            <Routes>
                <Route path="/" element={
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
                }/>

                <Route path="/checkout" element={<Checkout/>}/>
                <Route path="/order-success" element={<OrderSuccess/>}/>
            </Routes>

            <FloatingCartBar/>
        </BrowserRouter>
    );
}

export default App;