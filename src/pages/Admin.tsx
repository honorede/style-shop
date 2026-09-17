// src/pages/Admin.tsx
import React, {useEffect, useState} from 'react';
import {useCart} from '../context/CartContext';
import {useUser} from '../context/UserContext';
import {useSettings} from '../context/SettingsContext';
import {getAllUsers, updateUserProfile, type UserProfile} from '../firebase/userService';
import {resetNavigationSettings} from '../firebase/settingsService';
import {generateProducts, PRESET_COUNTS} from '../utils/productGenerator';

type TabType = 'products' | 'users' | 'stats' | 'settings';

const Admin: React.FC = () => {
    const {user} = useUser();
    const {products, addProduct, updateProduct, deleteProduct, loadProducts, loading} = useCart();
    const {settings, updateSettings, refresh: refreshSettings} = useSettings();

    const [users, setUsers] = useState<UserProfile[]>([]);
    const [activeTab, setActiveTab] = useState<TabType>('products');
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [selectedCount, setSelectedCount] = useState(10);

    const [form, setForm] = useState({
        name: '',
        price: '',
        image: '📦',
        description: '',
        inStock: true,
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    const loadUsers = async () => {
        setLoadingUsers(true);
        try {
            const data = await getAllUsers();
            setUsers(data || []);
        } catch (error) {
            console.error('Ошибка загрузки пользователей:', error);
            setUsers([]);
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        loadProducts();
        loadUsers();
    }, []);

    // ============ ГЕНЕРАТОР ============
    const handleGenerateProducts = async () => {
        if (!confirm(`Сгенерировать ${selectedCount} товаров?`)) return;
        setGenerating(true);
        try {
            const newProducts = generateProducts(selectedCount);
            for (const product of newProducts) {
                await addProduct(product);
            }
            await loadProducts();
            alert(`✅ Добавлено ${newProducts.length} товаров!`);
        } catch (error) {
            console.error('Ошибка генерации:', error);
            alert('❌ Ошибка при генерации товаров');
        } finally {
            setGenerating(false);
        }
    };

    // ============ ТОВАРЫ ============
    const handleProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const productData = {
                name: form.name,
                price: parseFloat(form.price),
                image: form.image || '📦',
                description: form.description,
                inStock: form.inStock,
            };

            if (editingId) {
                await updateProduct(editingId, productData);
                setEditingId(null);
            } else {
                await addProduct(productData);
            }

            await loadProducts();
            setForm({name: '', price: '', image: '📦', description: '', inStock: true});
        } catch (error) {
            console.error('Ошибка сохранения:', error);
        } finally {
            setFormLoading(false);
        }
    };

    const handleEdit = (product: any) => {
        setForm({
            name: product.name || '',
            price: String(product.price || ''),
            image: product.image || '📦',
            description: product.description || '',
            inStock: product.inStock !== undefined ? product.inStock : true,
        });
        setEditingId(product.id);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Удалить товар?')) {
            await deleteProduct(id);
        }
    };

    // ============ ПОЛЬЗОВАТЕЛИ ============
    const changeUserRole = async (uid: string, role: 'user' | 'admin') => {
        try {
            await updateUserProfile(uid, {role});
            await loadUsers();
        } catch (error) {
            console.error('Ошибка смены роли:', error);
        }
    };

    // ============ СТАТИСТИКА ============
    const stats = {
        totalProducts: products?.length || 0,
        totalUsers: users?.length || 0,
        totalAdmins: users?.filter(u => u.role === 'admin').length || 0,
    };

    const pageLabels: Record<string, string> = {
        home: '🏠 Главная',
        catalog: '🛍️ Каталог',
        cart: '🛒 Корзина',
        profile: '👤 Профиль',
        admin: '⚙️ Админка',
        login: '🔐 Вход',
        register: '📝 Регистрация',
    };

    // ⚠️ НЕТ ПРОВЕРОК! Просто рендерим админку.
    // Если ты здесь — значит App.tsx пропустил тебя как админа.

    return (
        <div className="container-custom py-8 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <h1 className="heading-1">⚙️ Админ-панель</h1>
                <span className="text-sm text-gray-400">Администратор: {user?.email || 'Unknown'}</span>
            </div>

            {/* Табы */}
            <div className="flex flex-wrap gap-2 mb-8">
                <button
                    onClick={() => setActiveTab('products')}
                    className={`px-4 py-2 rounded-xl transition ${
                        activeTab === 'products' ? 'bg-white text-black' : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
                    }`}
                >
                    📦 Товары ({products?.length || 0})
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 rounded-xl transition ${
                        activeTab === 'users' ? 'bg-white text-black' : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
                    }`}
                >
                    👥 Пользователи ({users?.length || 0})
                </button>
                <button
                    onClick={() => setActiveTab('stats')}
                    className={`px-4 py-2 rounded-xl transition ${
                        activeTab === 'stats' ? 'bg-white text-black' : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
                    }`}
                >
                    📊 Статистика
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-4 py-2 rounded-xl transition ${
                        activeTab === 'settings' ? 'bg-white text-black' : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
                    }`}
                >
                    ⚙️ Настройки
                </button>
            </div>

            {/* ============================================================ */}
            {/* ВКЛАДКА: ТОВАРЫ */}
            {activeTab === 'products' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="card lg:col-span-1">
                        <h2 className="heading-2 mb-6">
                            {editingId ? '✏️ Редактировать' : '➕ Добавить товар'}
                        </h2>

                        <form onSubmit={handleProductSubmit}>
                            <div className="mb-4">
                                <label className="block text-[var(--text-secondary)] font-medium mb-2">Название</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({...form, name: e.target.value})}
                                    className="input-dark"
                                    placeholder="Кроссовки Nike"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-[var(--text-secondary)] font-medium mb-2">Цена ($)</label>
                                <input
                                    type="number"
                                    value={form.price}
                                    onChange={(e) => setForm({...form, price: e.target.value})}
                                    className="input-dark"
                                    placeholder="120"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-[var(--text-secondary)] font-medium mb-2">Эмодзи</label>
                                <input
                                    type="text"
                                    value={form.image}
                                    onChange={(e) => setForm({...form, image: e.target.value})}
                                    className="input-dark"
                                    placeholder="👟"
                                    maxLength={2}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-[var(--text-secondary)] font-medium mb-2">Описание</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({...form, description: e.target.value})}
                                    className="input-dark"
                                    placeholder="Краткое описание"
                                    rows={2}
                                />
                            </div>

                            <div className="mb-6">
                                <label className="flex items-center gap-2 text-[var(--text-secondary)] font-medium">
                                    <input
                                        type="checkbox"
                                        checked={form.inStock}
                                        onChange={(e) => setForm({...form, inStock: e.target.checked})}
                                        className="w-4 h-4"
                                    />
                                    В наличии
                                </label>
                            </div>

                            <div className="flex gap-3">
                                <button type="submit" className="btn-primary flex-1" disabled={formLoading}>
                                    {formLoading ? '...' : editingId ? '💾 Обновить' : '➕ Добавить'}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingId(null);
                                            setForm({name: '', price: '', image: '📦', description: '', inStock: true});
                                        }}
                                        className="btn-secondary"
                                    >
                                        Отмена
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="heading-2">📦 Все товары ({products?.length || 0})</h2>
                        </div>

                        <div className="mb-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm text-blue-400 font-medium">🤖 Генератор товаров</p>
                                    <p className="text-xs text-gray-500">Быстро заполните каталог тестовыми данными</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={selectedCount}
                                        onChange={(e) => setSelectedCount(Number(e.target.value))}
                                        className="px-3 py-1.5 text-sm bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                                    >
                                        {PRESET_COUNTS.map(count => (
                                            <option key={count} value={count}>{count}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleGenerateProducts}
                                        disabled={generating}
                                        className="px-4 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {generating ? (
                                            <span className="flex items-center gap-2">
                                                <span
                                                    className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full"/>
                                                Генерация...
                                            </span>
                                        ) : (
                                            '🚀 Сгенерировать'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <p className="text-gray-400">Загрузка...</p>
                        ) : !products || products.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <p>Нет товаров. Добавьте первый!</p>
                                <p className="text-xs text-gray-500 mt-1">Или используйте генератор выше ⬆️</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                                {products.map(product => (
                                    <div key={product.id} className="card flex justify-between items-center p-4">
                                        <div className="flex items-center gap-4">
                                            <span className="text-3xl">{product.image || '📦'}</span>
                                            <div>
                                                <h3 className="heading-3 text-sm">{product.name}</h3>
                                                <p className="text-muted text-sm">
                                                    ${product.price} • {product.inStock ? '✅ В наличии' : '❌ Нет в наличии'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="text-blue-400 hover:text-blue-300 transition text-sm px-2 py-1 rounded hover:bg-[#2a2a2a]"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => product.id && handleDelete(product.id)}
                                                className="text-red-400 hover:text-red-300 transition text-sm px-2 py-1 rounded hover:bg-[#2a2a2a]"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ============================================================ */}
            {/* ВКЛАДКА: ПОЛЬЗОВАТЕЛИ */}
            {activeTab === 'users' && (
                <div className="card overflow-x-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="heading-2">👥 Все пользователи ({users?.length || 0})</h2>
                        <button onClick={loadUsers} className="text-sm text-blue-400 hover:text-blue-300">
                            🔄 Обновить
                        </button>
                    </div>

                    {loadingUsers ? (
                        <p className="text-gray-400">Загрузка...</p>
                    ) : !users || users.length === 0 ? (
                        <p className="text-gray-400">Пользователей пока нет</p>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="text-muted text-sm border-b border-[var(--border-light)]">
                            <tr>
                                <th className="pb-3">Email</th>
                                <th className="pb-3">Имя</th>
                                <th className="pb-3">Роль</th>
                                <th className="pb-3">Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user) => (
                                <tr key={user.uid} className="border-b border-[var(--border-light)] last:border-0">
                                    <td className="py-3 text-sm">{user.email}</td>
                                    <td className="py-3">{user.displayName || '-'}</td>
                                    <td className="py-3">
                                      <span className={`text-xs font-medium ${
                                          user.role === 'admin' ? 'text-green-400' : 'text-gray-400'
                                      }`}>
                                        {user.role === 'admin' ? '👑 Админ' : '👤 Пользователь'}
                                      </span>
                                    </td>
                                    <td className="py-3">
                                        <button
                                            onClick={() => changeUserRole(user.uid, user.role === 'admin' ? 'user' : 'admin')}
                                            className="text-xs px-3 py-1 rounded-lg bg-[#1a1a1a] hover:bg-[#2a2a2a] transition"
                                        >
                                            {user.role === 'admin' ? '⬇️ Снять права' : '⬆️ Назначить админом'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* ============================================================ */}
            {/* ВКЛАДКА: СТАТИСТИКА */}
            {activeTab === 'stats' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card text-center">
                        <div className="text-4xl mb-2">📦</div>
                        <h3 className="heading-3">{stats.totalProducts}</h3>
                        <p className="text-muted text-sm">Товаров</p>
                    </div>

                    <div className="card text-center">
                        <div className="text-4xl mb-2">👥</div>
                        <h3 className="heading-3">{stats.totalUsers}</h3>
                        <p className="text-muted text-sm">Пользователей</p>
                    </div>

                    <div className="card text-center">
                        <div className="text-4xl mb-2">👑</div>
                        <h3 className="heading-3">{stats.totalAdmins}</h3>
                        <p className="text-muted text-sm">Администраторов</p>
                    </div>
                </div>
            )}

            {/* ============================================================ */}
            {/* ВКЛАДКА: НАСТРОЙКИ */}
            {activeTab === 'settings' && (
                <div className="card">
                    <h2 className="heading-2 mb-4">⚙️ Настройки навигации</h2>
                    <p className="text-muted text-sm mb-6">
                        Включайте или отключайте страницы. Отключённые страницы исчезнут из навигации и ленты.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(settings).map(([key, value]) => (
                            <div key={key}
                                 className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-xl border border-[#1a1a1a]">
                                <span className="text-white font-medium">
                                    {pageLabels[key] || key}
                                </span>
                                <button
                                    onClick={() => updateSettings({[key]: !value})}
                                    className={`px-4 py-1.5 rounded-xl transition ${
                                        value
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    }`}
                                >
                                    {value ? '✅ Вкл' : '❌ Выкл'}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={async () => {
                                if (confirm('Сбросить настройки по умолчанию?')) {
                                    await resetNavigationSettings();
                                    await refreshSettings();
                                }
                            }}
                            className="text-sm text-red-400 hover:text-red-300 transition border border-red-500/30 px-4 py-2 rounded-xl"
                        >
                            🔄 Сбросить настройки
                        </button>
                        <button
                            onClick={refreshSettings}
                            className="text-sm text-blue-400 hover:text-blue-300 transition border border-blue-500/30 px-4 py-2 rounded-xl"
                        >
                            🔄 Обновить
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;