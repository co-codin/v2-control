export const userRoutes = (resolve) => [
    {
        path: '/users',
        name: 'users.index',
        component: resolve(__dirname, '../pages/index.vue'),
        meta: {
            permissions: ['view users']
        }
    },
    {
        path: '/users/create',
        name: 'users.create',
        component: resolve(__dirname, '../pages/create.vue'),
        meta: {
            permissions: ['create users']
        }
    },
    {
        path: '/users/:id/update',
        name: 'users.update',
        component: resolve(__dirname, '../pages/update.vue'),
        meta: {
            permissions: ['edit users']
        }
    },
];
