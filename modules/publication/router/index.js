export const publicationRoutes = (resolve) => [
    {
        path: '/publications',
        name: 'publications.index',
        component: resolve(__dirname, '../pages/index.vue'),
    },
    {
        path: '/publications/create',
        name: 'publications.create',
        component: resolve(__dirname, '../pages/create.vue'),
    },
    {
        path: '/publications/:id/update',
        name: 'publications.update',
        component: resolve(__dirname, '../pages/update.vue'),
    },
];
