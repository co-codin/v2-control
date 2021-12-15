export const fieldValueRoutes = (resolve) => [
    {
        path: '/field-values',
        name: 'field-values.index',
        component: resolve(__dirname, '../pages/index.vue'),
    },
    {
        path: '/field-values/create',
        name: 'field-values.create',
        component: resolve(__dirname, '../pages/create.vue'),
    },
    {
        path: '/field-values/:id/update',
        name: 'field-values.update',
        component: resolve(__dirname, '../pages/update.vue'),
    },
];
