export const exportRoutes = (resolve) => [
    {
        path: '/exports',
        name: 'exports.index',
        component: resolve(__dirname, '../pages/index.vue'),
    },
    {
        path: '/exports/create',
        name: 'exports.create',
        component: resolve(__dirname, '../pages/create.vue'),
    },
    {
        path: '/exports/:id/update',
        name: 'exports.update',
        component: resolve(__dirname, '../pages/update.vue'),
    },
];
