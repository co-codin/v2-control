export const fileType = Object.freeze({
    TIU: 1,
    GOOGLE_MERCHANT: 2,
    FACEBOOK: 3,
    AVITO: 4,
    PULS_CEN: 5,
    SATOM: 6,
});

export const fileExtensions = new Map([
    [fileType.TIU, 'xml'],
    [fileType.GOOGLE_MERCHANT, 'xml'],
    [fileType.FACEBOOK, 'csv'],
    [fileType.AVITO, 'csv'],
    [fileType.PULS_CEN, 'xml'],
    [fileType.SATOM, 'xml'],
]);
