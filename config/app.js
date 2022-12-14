export default {
    name: process.env.APP_NAME || 'MEDEQ',
    url: process.env.APP_URL || 'http://localhost:3000',
    siteUrl: process.env.SITE_URL || 'https://medeq.ru',
    storageUrl: process.env.STORAGE_URL,
    contentUrl: process.env.CONTENT_API_URL,
    apiUrl: process.env.API_URL,
};
