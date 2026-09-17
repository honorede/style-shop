// src/components/GearBackground.tsx
import React, {useEffect, useRef} from 'react';
import {useLocation} from 'react-router-dom';

const GearBackground: React.FC = () => {
    const location = useLocation();
    const containerRef = useRef<HTMLDivElement>(null);
    const rotationRef = useRef(0);
    const animRef = useRef<number | null>(null);
    const colorRef = useRef('#4f8cf7');

    const getConfig = () => {
        const hash = location.hash.replace('#', '');
        const path = location.pathname;
        const key = path === '/' ? hash : path.replace('/', '');

        const map: Record<string, { color: string; speed: number; dir: number }> = {
            '': {color: '#4f8cf7', speed: 0.15, dir: 1},
            'home': {color: '#4f8cf7', speed: 0.15, dir: 1},
            'catalog': {color: '#f7b731', speed: 0.5, dir: 1},
            'cart': {color: '#f77f6e', speed: 0.4, dir: -1},
            'profile': {color: '#6dd5a0', speed: 0.2, dir: 1},
            'admin': {color: '#ff6b6b', speed: 0.08, dir: -1},
            'login': {color: '#74b9ff', speed: 0.25, dir: 1},
            'register': {color: '#a29bfe', speed: 0.25, dir: 1},
            'checkout': {color: '#fd79a8', speed: 0.1, dir: 1},
            'order-success': {color: '#55efc4', speed: 0.05, dir: 1},
        };
        return map[key] || map[''];
    };

    useEffect(() => {
        const config = getConfig();
        colorRef.current = config.color;

        const animate = () => {
            if (containerRef.current) {
                rotationRef.current += config.speed * config.dir;
                containerRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
            }
            animRef.current = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, [location]);

    useEffect(() => {
        rotationRef.current = 0;
    }, [location]);

    const color = colorRef.current;

    return (
        <div
            ref={containerRef}
            className="fixed -bottom-24 -right-24 z-0 pointer-events-none select-none"
            style={{
                transform: 'rotate(0deg)',
                opacity: 0.12,
                transition: 'color 1s ease',
                color: color,
                filter: `drop-shadow(0 0 60px ${color}55)`,
            }}
        >
            <svg width="400" height="400" viewBox="0 0 200 200">
                {/* Основной круг */}
                <circle cx="100" cy="100" r="65" fill="none" stroke={color} strokeWidth="10" opacity="0.3"/>
                <circle cx="100" cy="100" r="40" fill="none" stroke={color} strokeWidth="6" opacity="0.2"/>
                <circle cx="100" cy="100" r="10" fill={color} opacity="0.4"/>

                {/* 8 зубцов */}
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                    const angle = (i / 8) * Math.PI * 2;
                    const r1 = 70;
                    const r2 = 88;
                    const x1 = 100 + Math.cos(angle) * r1;
                    const y1 = 100 + Math.sin(angle) * r1;
                    const x2 = 100 + Math.cos(angle) * r2;
                    const y2 = 100 + Math.sin(angle) * r2;
                    const op = 0.25 + (i / 8) * 0.5;

                    return (
                        <g key={i}>
                            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="12" strokeLinecap="round"
                                  opacity={op}/>
                            <line x1={x1 - Math.sin(angle) * 6} y1={y1 + Math.cos(angle) * 6}
                                  x2={x2 - Math.sin(angle) * 6} y2={y2 + Math.cos(angle) * 6} stroke={color}
                                  strokeWidth="5" strokeLinecap="round" opacity={op * 0.6}/>
                            <line x1={x1 + Math.sin(angle) * 6} y1={y1 - Math.cos(angle) * 6}
                                  x2={x2 + Math.sin(angle) * 6} y2={y2 - Math.cos(angle) * 6} stroke={color}
                                  strokeWidth="5" strokeLinecap="round" opacity={op * 0.6}/>
                        </g>
                    );
                })}

                {/* Малые зубцы */}
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                    const angle = (i / 8) * Math.PI * 2 + Math.PI / 8;
                    const x1 = 100 + Math.cos(angle) * 55;
                    const y1 = 100 + Math.sin(angle) * 55;
                    const x2 = 100 + Math.cos(angle) * 65;
                    const y2 = 100 + Math.sin(angle) * 65;
                    return (
                        <line key={`s-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="5"
                              strokeLinecap="round" opacity={0.12}/>
                    );
                })}
            </svg>
        </div>
    );
};

export default GearBackground;