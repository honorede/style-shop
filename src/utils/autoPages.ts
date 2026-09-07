// src/utils/autoPages.ts

// Автоматический импорт всех страниц из папки pages
const pageModules = import.meta.glob('../pages/*.tsx', { eager: true });

export interface AutoPage {
    path: string;
    label: string;
    component: React.ComponentType;
    color: string;
}

// Функция для генерации цвета из строки (стабильный хэш)
const stringToColor = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Превращаем хэш в HSL цвет с насыщенностью 60% и яркостью 60%
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 60%)`;
};

// Получаем все страницы автоматически
export const autoPages: AutoPage[] = Object.entries(pageModules)
    .map(([filePath, module]) => {
        // Извлекаем имя файла без расширения
        const fileName = filePath.split('/').pop()?.replace('.tsx', '') || '';

        // Пропускаем файлы, которые не являются страницами (если есть)
        if (fileName === 'index' || fileName === 'PageTemplate') return null;

        // Получаем компонент (экспорт по умолчанию)
        const component = (module as any).default;
        if (!component) return null;

        // Генерируем путь (например, Profile -> /profile)
        const path = `/${fileName.toLowerCase()}`;

        // Генерируем метку (Profile -> ПРОФИЛЬ)
        const label = fileName.replace(/([A-Z])/g, ' $1').trim().toUpperCase();

        // Генерируем цвет из имени файла
        const color = stringToColor(fileName);

        return {
            path,
            label,
            component,
            color,
        };
    })
    .filter((page): page is AutoPage => page !== null);

// Сортируем страницы: сначала Home, остальные по алфавиту
export const sortedPages = autoPages.sort((a, b) => {
    if (a.path === '/home') return -1;
    if (b.path === '/home') return 1;
    return a.label.localeCompare(b.label);
});

// Функция для получения страницы по пути
export const getPageByPath = (path: string): AutoPage | undefined => {
    return sortedPages.find(p => p.path === path);
};

// Функция для получения индекса страницы (для шестерёнки)
export const getPageIndex = (path: string): number => {
    return sortedPages.findIndex(p => p.path === path);
};