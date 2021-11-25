export const type = Object.freeze({
    CheckMarkList: 1,
    Slider: 2,
    CheckMark: 3,
});

export const typeDescriptions = new Map([
    [type.CheckMarkList, 'Список галочек'],
    [type.Slider, 'Слайдер'],
    [type.CheckMark, 'Галочка'],
]);

export const typeLabels = [
    { value: 1, text: 'Список галочек' },
    { value: 2, text: 'Слайдер' },
    { value: 3, text: 'Галочка' },
];
