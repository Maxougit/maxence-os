import React, { useState } from 'react';
import styles from './Explorer.module.css';

const initialData = {
    '/': [
        { type: 'folder', name: 'Documents' },
        { type: 'folder', name: 'Images' },
        { type: 'file', name: 'Todo.txt' },
    ],
    '/Documents': [
        { type: 'file', name: 'CV.pdf' },
        { type: 'file', name: 'Budget.xlsx' },
    ],
    '/Images': [
        { type: 'file', name: 'Vacances.jpg' },
        { type: 'file', name: 'Famille.png' },
    ],
};

const Explorer = () => {
    const [currentPath, setCurrentPath] = useState('/');
    const [history, setHistory] = useState(['/']);

    const navigateTo = (path) => {
        const newPath = currentPath === '/' ? `/${path}` : `${currentPath}/${path}`;
        setCurrentPath(newPath);
        setHistory(prev => [...prev, newPath]);
    };

    const goBack = () => {
        setHistory(prev => {
            const newHistory = prev.slice(0, prev.length - 1);
            setCurrentPath(newHistory[newHistory.length - 1] || '/');
            return newHistory;
        });
    };

    const items = initialData[currentPath] || [];

    return (
        <div className={styles.explorer}>
            <div className={styles.toolbar}>
                <button onClick={goBack} disabled={history.length <= 1}>Retour</button>
                <span>{currentPath}</span>
            </div>
            <div className={styles.content}>
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={`${styles.item} ${item.type === 'folder' ? styles.folder : styles.file}`}
                        onClick={() => item.type === 'folder' && navigateTo(item.name)}
                    >
                        {item.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Explorer;
