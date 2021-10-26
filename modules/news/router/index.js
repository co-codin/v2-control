export const newsRoutes = (resolve) => [
    {
        path: '/news',
        name: 'news.index',
        component: resolve(__dirname, '../pages/index.vue'),
    },
    {
        path: '/news/create',
        name: 'news.create',
        component: resolve(__dirname, '../pages/create.vue'),
    },
    {
        path: '/news/:id/update',
        name: 'news.update',
        component: resolve(__dirname, '../pages/update.vue'),
    },
];
