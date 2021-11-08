export const userRoutes = (resolve) => [
    {
        path: '/user',
        name: 'user',
        component: resolve(__dirname, '../pages/user.vue'),
    },
    {
        path: '/user/logout',
        name: 'user.logout',
        component: resolve(__dirname, '../pages/logout.vue'),
    },
];
