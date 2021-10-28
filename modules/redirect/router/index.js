export const redirectRoutes = (resolve) => [
    {
        path: '/redirects',
        name: 'redirects.index',
        component: resolve(__dirname, '../pages/index.vue'),
    },
    {
        path: '/redirects/create',
        name: 'redirects.create',
        component: resolve(__dirname, '../pages/create.vue'),
    },
    {
        path: '/redirects/:id/update',
        name: 'redirects.update',
        component: resolve(__dirname, '../pages/update.vue'),
    },
];
