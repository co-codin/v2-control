export const currencyRoutes = (resolve) => [
    {
        path: '/currencies',
        name: 'currencies.index',
        component: resolve(__dirname, '../pages/index.vue'),
    },
    {
        path: '/currencies/create',
        name: 'currencies.create',
        component: resolve(__dirname, '../pages/create.vue'),
    },
    {
        path: '/currencies/:id/update',
        name: 'currencies.update',
        component: resolve(__dirname, '../pages/update.vue'),
    },
];
