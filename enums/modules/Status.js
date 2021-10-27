export const Status = Object.freeze({
    Active: 1,
    Inactive: 2,
    OnlyByUrl: 3,
});

export const statusDescriptions = new Map([
    [Status.Active, 'Отображается на сайте'],
    [Status.Inactive, 'Скрыто'],
    [Status.OnlyByUrl, 'Доступно только Url'],
]);

export const statusLabels = [
    { value: 1, text: 'Отображается на сайте' },
    { value: 2, text: 'Скрыто' },
    { value: 3, text: 'Доступно только по URL' },
];
