export const propertyRoutes = (resolve) => [
    {
        path: '/properties',
        name: 'properties.index',
        component: resolve(__dirname, '../pages/index.vue'),
    },
    {
        path: '/properties/create',
        name: 'properties.create',
        component: resolve(__dirname, '../pages/create.vue'),
    },
    {
        path: '/properties/:id/update',
        name: 'properties.update',
        component: resolve(__dirname, '../pages/update.vue'),
    },
];
