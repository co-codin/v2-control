export const Group = Object.freeze({
    PRIORITY: 1,
    REORIENTATED: 2,
    SIMPLIFIED: 3,
    IMPOSSIBLE: 4,
});

export const groupDescriptions = new Map([
    [Group.PRIORITY, 'Приоритет продаж'],
    [Group.REORIENTATED, 'Переориентация продаж'],
    [Group.SIMPLIFIED, 'Упрощенная продажа'],
    [Group.IMPOSSIBLE, 'Невозможные к продаже'],
]);

export const groupLabels = [
    { value: 1, text: 'Приоритет продаж' },
    { value: 2, text: 'Переориентация продаж' },
    { value: 3, text: 'Упрощенная продажа' },
    { value: 4, text: 'Невозможные к продаже' },
];
