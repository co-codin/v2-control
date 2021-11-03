export const attributeRoutes = (resolve) => [
    {
        path: '/attributes',
        name: 'attributes.index',
        component: resolve(__dirname, '../pages/index.vue'),
    },
    {
        path: '/attributes/create',
        name: 'attributes.create',
        component: resolve(__dirname, '../pages/create.vue'),
    },
    {
        path: '/attributes/:id/update',
        name: 'attributes.update',
        component: resolve(__dirname, '../pages/update.vue'),
    },
];
