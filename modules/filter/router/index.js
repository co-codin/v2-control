export const filterRoutes = (resolve) => [
    {
        path: '/filters',
        name: 'filters.index',
        component: resolve(__dirname, '../pages/index.vue'),
    },
    {
        path: '/filters/create',
        name: 'filters.create',
        component: resolve(__dirname, '../pages/create.vue'),
    },
    {
        path: '/filters/:id/update',
        name: 'filters.update',
        component: resolve(__dirname, '../pages/update.vue'),
    },
];
