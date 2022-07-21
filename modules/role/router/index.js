export const roleRoutes = (resolve) => [
    {
        path: '/roles',
        name: 'roles.index',
        component: resolve(__dirname, '../pages/role/index.vue'),
    },
    {
        path: '/roles/create',
        name: 'roles.create',
        component: resolve(__dirname, '../pages/role/create.vue'),
    },
    {
        path: '/roles/:id/update',
        name: 'roles.update',
        component: resolve(__dirname, '../pages/role/update.vue'),
    },
];
