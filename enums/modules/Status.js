export const Status = Object.freeze({
    Active: 1,
    Inactive: 2,

    OnlyByUrl: 3,
});

export const StatusDescription = new Map([
    [Status.Active, 'Отображается на сайте'],
    [Status.Inactive, 'Скрыто'],
    [Status.OnlyByUrl, 'Доступно только Url'],
]);
