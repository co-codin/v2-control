export const activityRoutes = (resolve) => [
    {
        path: '/activities',
        name: 'activities.index',
        component: resolve(__dirname, '../pages/index.vue'),
        meta: {
            permissions: ['view activity log']
        }
    },
];
