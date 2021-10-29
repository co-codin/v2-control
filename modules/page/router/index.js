export const pageRoutes = (resolve) => [
    {
        path: '/pages',
        name: 'pages.index',
        component: resolve(__dirname, '../pages/index.vue'),
    },
    {
        path: '/pages/create',
        name: 'pages.create',
        component: resolve(__dirname, '../pages/create.vue'),
    },
    {
        path: '/pages/:id/update',
        name: 'pages.update',
        component: resolve(__dirname, '../pages/update.vue'),
    },
];
