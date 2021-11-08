export const canonicalRoutes = (resolve) => [
    {
        path: '/canonicals',
        name: 'canonicals.index',
        component: resolve(__dirname, '../pages/index.vue'),
    },
    {
        path: '/canonicals/create',
        name: 'canonicals.create',
        component: resolve(__dirname, '../pages/create.vue'),
    },
    {
        path: '/canonicals/:id/update',
        name: 'canonicals.update',
        component: resolve(__dirname, '../pages/update.vue'),
    },
];
