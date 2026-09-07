import {useEffect, useState} from 'react';

export type ViewMode = 'grid' | 'list';

const STORAGE_KEY = 'shop_view_mode';

export const useViewMode = () => {
    const [viewMode, setViewMode] = useState<ViewMode>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return (saved === 'grid' || saved === 'list') ? saved : 'grid';
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, viewMode);
    }, [viewMode]);

    const toggleView = () => {
        setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
    };

    return {viewMode, setViewMode, toggleView};
};