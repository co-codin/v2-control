export const userRoutes = (resolve) => [
    {
        path: '/user',
        name: 'user',
        component: resolve(__dirname, '../pages/user.vue'),
    },
];
