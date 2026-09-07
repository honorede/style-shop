export interface PageConfig {
    path: string;
    label: string;
    color: string;        // Цвет зуба для этой страницы
    rotation: number;     // Угол поворота (0–360)
}

export const pages: PageConfig[] = [
    { path: '/', label: 'ГЛАВНАЯ', color: '#888888', rotation: 0 },
    { path: '/catalog', label: 'КАТАЛОГ', color: '#4CAF50', rotation: 72 },
    { path: '/cart', label: 'КОРЗИНА', color: '#FF9800', rotation: 144 },
    { path: '/admin', label: 'АДМИНКА', color: '#F44336', rotation: 216 },
];

// Функция для получения конфига страницы по пути
export const getPageConfig = (path: string): PageConfig => {
    const page = pages.find(p => p.path === path);
    return page || pages[0]; // Если не найдено — возвращаем первую
};

// Функция для получения индекса страницы (нумерация зубьев)
export const getPageIndex = (path: string): number => {
    return pages.findIndex(p => p.path === path);
};