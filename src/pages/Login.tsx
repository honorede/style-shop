import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {loginUser} from '../firebase/services';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await loginUser(email, password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Ошибка входа');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-custom py-8 animate-fade-in">
            <div className="card max-w-md mx-auto">
                <h1 className="heading-2 text-center mb-6">🔐 Вход</h1>

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

                    <div className="mb-6">
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

                    <button
                        type="submit"
                        className="btn-primary w-full"
                        disabled={loading}
                    >
                        {loading ? 'Загрузка...' : 'Войти →'}
                    </button>
                </form>

                <p className="text-center text-muted mt-4">
                    Нет аккаунта? <Link to="/register" className="text-white hover:underline">Зарегистрироваться</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;