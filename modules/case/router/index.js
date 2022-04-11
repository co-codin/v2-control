export const caseRoutes = (resolve) => [
    {
        path: '/cases',
        name: 'cases.index',
        component: resolve(__dirname, '../pages/index.vue'),
    },
    {
        path: '/cases/create',
        name: 'cases.create',
        component: resolve(__dirname, '../pages/create.vue'),
    },
    {
        path: '/cases/:id/update',
        name: 'cases.update',
        component: resolve(__dirname, '../pages/update.vue'),
    },
];
