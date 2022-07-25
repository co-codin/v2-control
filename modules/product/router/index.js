export const productRoutes = (resolve) => [
    {
        path: '/products',
        name: 'products.index',
        component: resolve(__dirname, '../pages/index.vue'),
        meta: {
            permissions: ['view products']
        }
    },
    {
        path: '/products/create',
        name: 'products.create',
        component: resolve(__dirname, '../pages/create.vue'),
        meta: {
            permissions: ['create products']
        }
    },
    {
        path: '/products/:id/update',
        name: 'products.update',
        component: resolve(__dirname, '../pages/update.vue'),
        meta: {
            permissions: ['edit products']
        }
    },
];
