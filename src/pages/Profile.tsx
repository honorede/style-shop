import React, {useState} from 'react';
import {useUser} from '../context/UserContext';
import {updateUserProfile} from '../firebase/userService';
import {logoutUser} from '../firebase/services';
import {useNavigate} from 'react-router-dom';

const Profile: React.FC = () => {
    const {user, profile, refreshProfile} = useUser();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        displayName: profile?.displayName || '',
        phone: profile?.phone || '',
        address: profile?.address || '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setMessage('');
        try {
            await updateUserProfile(user.uid, form);
            await refreshProfile();
            setMessage('✅ Профиль обновлён!');
            setEditing(false);
        } catch (error) {
            setMessage('❌ Ошибка обновления');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logoutUser();
        navigate('/');
    };

    if (!user) {
        return (
            <div className="container-custom py-8">
                <h1 className="heading-1 mb-8">👤 Профиль</h1>
                <div className="card text-center py-12">
                    <p className="text-body text-xl">⚠️ Вы не авторизованы</p>
                    <p className="text-muted mt-2">Войдите в аккаунт</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-custom py-8 animate-fade-in">
            <h1 className="heading-1 mb-8">👤 Профиль</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card md:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="heading-2">Личные данные</h2>
                        <button
                            onClick={() => setEditing(!editing)}
                            className="text-sm text-blue-400 hover:text-blue-300"
                        >
                            {editing ? 'Отмена' : '✏️ Редактировать'}
                        </button>
                    </div>

                    {message && (
                        <div
                            className={`p-3 rounded-xl mb-4 ${message.includes('✅') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleUpdate}>
                        <div className="mb-4">
                            <label className="block text-[var(--text-secondary)] font-medium mb-2">Email</label>
                            <input
                                type="email"
                                value={user.email || ''}
                                className="input-dark opacity-50 cursor-not-allowed"
                                disabled
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-[var(--text-secondary)] font-medium mb-2">Имя</label>
                            <input
                                type="text"
                                value={form.displayName}
                                onChange={(e) => setForm({...form, displayName: e.target.value})}
                                className="input-dark"
                                disabled={!editing}
                                placeholder="Ваше имя"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-[var(--text-secondary)] font-medium mb-2">Телефон</label>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={(e) => setForm({...form, phone: e.target.value})}
                                className="input-dark"
                                disabled={!editing}
                                placeholder="+7 (999) 123-45-67"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-[var(--text-secondary)] font-medium mb-2">Адрес</label>
                            <textarea
                                value={form.address}
                                onChange={(e) => setForm({...form, address: e.target.value})}
                                className="input-dark"
                                disabled={!editing}
                                placeholder="г. Москва, ул. Примерная, д. 1"
                                rows={2}
                            />
                        </div>

                        {editing && (
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Сохранение...' : '💾 Сохранить изменения'}
                            </button>
                        )}
                    </form>
                </div>

                <div className="space-y-4">
                    <div className="card">
                        <h3 className="heading-3 mb-2">Роль</h3>
                        <p className={`font-medium ${profile?.role === 'admin' ? 'text-green-400' : 'text-gray-400'}`}>
                            {profile?.role === 'admin' ? '👑 Администратор' : '👤 Пользователь'}
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="btn-secondary w-full text-center text-red-400 hover:text-red-300 border-red-500/20 hover:border-red-500/40"
                    >
                        🚪 Выйти
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;