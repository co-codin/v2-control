export const productRoutes = (resolve) => [
    {
        path: '/products',
        name: 'products.index',
        component: resolve(__dirname, '../pages/index.vue'),
    },
    {
        path: '/products/create',
        name: 'products.create',
        component: resolve(__dirname, '../pages/create.vue'),
    },
    {
        path: '/products/:id/update',
        name: 'products.update',
        component: resolve(__dirname, '../pages/update.vue'),
    },
];
