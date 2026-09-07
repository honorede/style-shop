export interface GeneratedProduct {
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
    inStock: boolean;
}

// Списки для генерации
const categories = [
    'Одежда', 'Обувь', 'Электроника', 'Аксессуары',
    'Дом', 'Спорт', 'Игрушки', 'Книги', 'Красота', 'Продукты'
];

const emojis = [
    '👕', '👗', '👔', '🧥', '🧦', '👟', '🥾', '👠', '👢', '👒',
    '🧢', '🎒', '👜', '👝', '💼', '👓', '🕶️', '⌚', '💍', '📱',
    '💻', '🖥️', '⌨️', '🖱️', '🖨️', '📷', '🎥', '🎧', '📺', '📡',
    '🔊', '🔋', '💡', '🕯️', '🧸', '🎮', '🎯', '🎲', '🧩', '📚'
];

const productNames = {
    'Одежда': ['Футболка', 'Свитшот', 'Джинсы', 'Платье', 'Пальто', 'Худи', 'Шорты', 'Юбка', 'Рубашка', 'Куртка'],
    'Обувь': ['Кроссовки', 'Ботинки', 'Туфли', 'Сандалии', 'Сапоги', 'Кеды', 'Лоферы', 'Мокасины'],
    'Электроника': ['Телефон', 'Ноутбук', 'Наушники', 'Колонка', 'Планшет', 'Смарт-часы', 'Фитнес-браслет', 'Зарядка'],
    'Аксессуары': ['Сумка', 'Рюкзак', 'Кошелёк', 'Ремень', 'Шарф', 'Перчатки', 'Зонт', 'Очки'],
    'Дом': ['Лампа', 'Ваза', 'Часы', 'Подушка', 'Плед', 'Свеча', 'Картина', 'Ковёр'],
    'Спорт': ['Мяч', 'Гантели', 'Коврик', 'Бутылка', 'Форма', 'Кроссовки', 'Тренажёр'],
    'Игрушки': ['Конструктор', 'Кукла', 'Машинка', 'Мягкая игрушка', 'Пазл', 'Настольная игра'],
    'Книги': ['Роман', 'Детектив', 'Фантастика', 'Бизнес-литература', 'Кулинария', 'Психология'],
    'Красота': ['Крем', 'Шампунь', 'Духи', 'Тушь', 'Помада', 'Лак', 'Маска'],
    'Продукты': ['Чай', 'Кофе', 'Мёд', 'Джем', 'Макароны', 'Соус', 'Специи']
};

const brandNames = ['Nike', 'Adidas', 'Samsung', 'Apple', 'Sony', 'Zara', 'H&M', 'Levi\'s', 'Gucci', 'Puma', 'Reebok', 'Samsung', 'Xiaomi'];

const descriptions = [
    'Стильный и качественный {name} от бренда {brand}.',
    'Отличный выбор для повседневного использования.',
    'Современный дизайн и превосходное качество.',
    'Надёжный {name} по доступной цене.',
    'Универсальная вещь, которая подойдёт к любому образу.',
    'Практичный и долговечный {name} для вашего комфорта.',
    'Брендовый {name} высокого качества.',
    'Идеальный подарок для себя или близких.',
    'Создан для тех, кто ценит стиль и качество.',
    'Лучший выбор в своей категории.'
];

// Генератор случайного числа
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Выбор случайного элемента из массива
const pick = <T>(arr: T[]): T => arr[random(0, arr.length - 1)];

// Генерация одного товара
export const generateProduct = (): GeneratedProduct => {
    const category = pick(categories);
    const nameBase = pick(productNames[category as keyof typeof productNames] || ['Товар']);
    const brand = pick(brandNames);
    const fullName = `${brand} ${nameBase}`;

    // Генерация цены
    const price = random(10, 500);

    // Генерация описания
    const descriptionTemplate = pick(descriptions);
    const description = descriptionTemplate
        .replace('{name}', nameBase.toLowerCase())
        .replace('{brand}', brand);

    return {
        name: fullName,
        price,
        image: pick(emojis),
        category,
        description,
        inStock: Math.random() > 0.2, // 80% в наличии
    };
};

// Генерация нескольких товаров
export const generateProducts = (count: number): GeneratedProduct[] => {
    const products: GeneratedProduct[] = [];
    for (let i = 0; i < count; i++) {
        products.push(generateProduct());
    }
    return products;
};

// Количество товаров для генерации
export const PRESET_COUNTS = [5, 10, 20, 50, 100];