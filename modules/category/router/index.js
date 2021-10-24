export const categoryRoutes = (resolve) => [
    {
        path: '/categories',
        name: 'categories.index',
        component: resolve(__dirname, '../pages/index.vue'),
    },
    {
        path: '/categories/create',
        name: 'categories.create',
        component: resolve(__dirname, '../pages/create.vue'),
    },
    {
        path: '/categories/:id/update',
        name: 'categories.update',
        component: resolve(__dirname, '../pages/update.vue'),
    },
];
