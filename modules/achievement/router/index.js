export const achievementRoutes = (resolve) => [
    {
        path: '/achievements',
        name: 'achievements.index',
        component: resolve(__dirname, '../pages/index.vue'),
    },
    {
        path: '/achievements/create',
        name: 'achievements.create',
        component: resolve(__dirname, '../pages/create.vue'),
    },
    {
        path: '/achievements/:id/update',
        name: 'achievements.update',
        component: resolve(__dirname, '../pages/update.vue'),
    },
];
