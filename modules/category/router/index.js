export const categoryRoutes = (resolve) => [
    {
        path: '/categories',
        name: 'categories.index',
        component: resolve(__dirname, '../pages/index.vue'),
        meta: {
            permissions: ['view categories']
        }
    },
    {
        path: '/categories/create',
        name: 'categories.create',
        component: resolve(__dirname, '../pages/create.vue'),
        meta: {
            permissions: ['create categories']
        }
    },
    {
        path: '/categories/:id/update',
        name: 'categories.update',
        component: resolve(__dirname, '../pages/update.vue'),
        meta: {
            permissions: ['edit categories']
        }
    },
];
