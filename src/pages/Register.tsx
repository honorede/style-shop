import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {registerUser} from '../firebase/services';
import {createUserProfile} from '../firebase/userService';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        if (password.length < 6) {
            setError('Пароль должен быть минимум 6 символов');
            return;
        }

        setLoading(true);

        try {
            const user = await registerUser(email, password);
            console.log('✅ Пользователь зарегистрирован:', user);

            if (user) {
                await createUserProfile(user, {
                    displayName: email.split('@')[0],
                });
                console.log('✅ Профиль создан в Firestore');
                navigate('/');
            }
        } catch (err: any) {
            console.error('❌ Ошибка регистрации:', err);
            setError(err.message || 'Ошибка регистрации');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-custom py-8 animate-fade-in">
            <div className="card max-w-md mx-auto">
                <h1 className="heading-2 text-center mb-6">📝 Регистрация</h1>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-[var(--text-secondary)] font-medium mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-dark"
                            placeholder="example@mail.com"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-[var(--text-secondary)] font-medium mb-2">Пароль</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-dark"
                            placeholder="Минимум 6 символов"
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-[var(--text-secondary)] font-medium mb-2">Подтвердите
                            пароль</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="input-dark"
                            placeholder="Повторите пароль"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary w-full"
                        disabled={loading}
                    >
                        {loading ? 'Загрузка...' : 'Создать аккаунт →'}
                    </button>
                </form>

                <p className="text-center text-muted mt-4">
                    Уже есть аккаунт? <Link to="/login" className="text-white hover:underline">Войти</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;