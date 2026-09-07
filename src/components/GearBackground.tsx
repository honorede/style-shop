import React, {useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import {useLocation} from 'react-router-dom';
import {getPageByPath, sortedPages} from '../utils/autoPages';

const GearBackground: React.FC = () => {
    const location = useLocation();
    const currentPage = getPageByPath(location.pathname);
    const totalTeeth = sortedPages.length;

    // Состояние для активной секции (по скроллу)
    const [activeSection, setActiveSection] = useState<string>(
        currentPage?.path || '/'
    );

    // Следим за скроллом — определяем видимую секцию
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        // Проверяем, есть ли такая страница в списке
                        const foundPage = sortedPages.find(p => p.path === `/${id}`);
                        if (foundPage) {
                            setActiveSection(`/${id}`);
                        }
                    }
                });
            },
            {
                threshold: 0.4, // 40% видимости
            }
        );

        // Наблюдаем за всеми секциями
        sortedPages.forEach((page) => {
            const id = page.path.replace('/', ''); // /catalog → catalog
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    // Если страница не найдена — не показываем шестерёнку
    if (!currentPage && !activeSection) return null;

    // Определяем активную страницу
    const activePage = sortedPages.find(p => p.path === activeSection) || currentPage || sortedPages[0];
    const activeIndex = sortedPages.indexOf(activePage);
    const targetRotation = (activeIndex * 360) / totalTeeth;

    const getToothRotation = (index: number) => {
        return (index * 360) / totalTeeth - 90;
    };

    return (
        <div className="fixed inset-0 -z-10 flex items-center justify-center pointer-events-none select-none">
            <motion.div
                className="relative w-[600px] h-[600px] opacity-30"
                animate={{rotate: targetRotation}}
                transition={{
                    type: 'spring',
                    stiffness: 50,
                    damping: 20,
                    duration: 1.2
                }}
            >
                <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* Центральная окружность */}
                    <circle cx="100" cy="100" r="40" fill="none" stroke="#444" strokeWidth="6"/>
                    <circle cx="100" cy="100" r="25" fill="none" stroke="#333" strokeWidth="5"/>
                    <circle cx="100" cy="100" r="8" fill="#555"/>

                    {/* Автоматические зубья для всех страниц */}
                    {sortedPages.map((page, index) => {
                        const angle = getToothRotation(index);
                        const rad = (angle * Math.PI) / 180;
                        const innerR = 45;
                        const outerR = 65;
                        const x1 = 100 + innerR * Math.cos(rad);
                        const y1 = 100 + innerR * Math.sin(rad);
                        const x2 = 100 + outerR * Math.cos(rad);
                        const y2 = 100 + outerR * Math.sin(rad);
                        const x3 = 100 + outerR * Math.cos(rad + 0.2);
                        const y3 = 100 + outerR * Math.sin(rad + 0.2);
                        const x4 = 100 + innerR * Math.cos(rad + 0.2);
                        const y4 = 100 + innerR * Math.sin(rad + 0.2);

                        const isActive = page.path === activeSection || page.path === location.pathname;

                        return (
                            <polygon
                                key={page.path}
                                points={`${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`}
                                fill={isActive ? page.color : '#2a2a2a'}
                                stroke="#1a1a1a"
                                strokeWidth="1"
                            />
                        );
                    })}

                    {/* Внутренние спицы */}
                    {[...Array(6)].map((_, i) => {
                        const angle = (i * 360) / 6;
                        const rad = (angle * Math.PI) / 180;
                        const x = 100 + 35 * Math.cos(rad);
                        const y = 100 + 35 * Math.sin(rad);
                        return (
                            <line
                                key={i}
                                x1="100"
                                y1="100"
                                x2={x}
                                y2={y}
                                stroke="#2a2a2a"
                                strokeWidth="3"
                            />
                        );
                    })}
                </svg>

                {/* Автоматические метки страниц */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full">
                        {sortedPages.map((page, index) => {
                            const angle = getToothRotation(index);
                            const rad = (angle * Math.PI) / 180;
                            const radius = 85;
                            const x = 100 + radius * Math.cos(rad);
                            const y = 100 + radius * Math.sin(rad);
                            const isActive = page.path === activeSection || page.path === location.pathname;

                            return (
                                <span
                                    key={page.path}
                                    className="absolute text-[10px] font-mono tracking-[0.15em] transition-colors duration-300"
                                    style={{
                                        left: `${x}%`,
                                        top: `${y}%`,
                                        transform: 'translate(-50%, -50%)',
                                        color: isActive ? page.color : '#444',
                                        opacity: isActive ? 0.8 : 0.3,
                                    }}
                                >
                                    {page.label}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default GearBackground;