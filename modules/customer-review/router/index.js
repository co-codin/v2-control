export const customerReviewRoutes = (resolve) => [
    {
        path: '/customer-reviews',
        name: 'customer-reviews.index',
        component: resolve(__dirname, '../pages/index.vue'),
    },
    {
        path: '/customer-reviews/create',
        name: 'customer-reviews.create',
        component: resolve(__dirname, '../pages/create.vue'),
    },
    {
        path: '/customer-reviews/:id/update',
        name: 'customer-reviews.update',
        component: resolve(__dirname, '../pages/update.vue'),
    },
];
