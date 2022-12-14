export const cityRoutes = (resolve) => [
    {
        path: '/cities',
        name: 'cities.index',
        component: resolve(__dirname, '../pages/index.vue'),
    },
    {
        path: '/cities/create',
        name: 'cities.create',
        component: resolve(__dirname, '../pages/create.vue'),
    },
    {
        path: '/cities/:id/update',
        name: 'cities.update',
        component: resolve(__dirname, '../pages/update.vue'),
    },
];
