export const bannerRoutes = (resolve) => [
    {
        path: '/banners',
        name: 'banners.index',
        component: resolve(__dirname, '../pages/index.vue'),
    },
    {
        path: '/banners/create',
        name: 'banners.create',
        component: resolve(__dirname, '../pages/create.vue'),
    },
    {
        path: '/banners/:id/update',
        name: 'banners.update',
        component: resolve(__dirname, '../pages/update.vue'),
    },
];
