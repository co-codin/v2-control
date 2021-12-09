export const productReviewRoutes = (resolve) => [
    {
        path: '/product-reviews',
        name: 'product-reviews.index',
        component: resolve(__dirname, '../pages/index.vue'),
    },
    {
        path: '/product-reviews/create',
        name: 'product-reviews.create',
        component: resolve(__dirname, '../pages/create.vue'),
    },
    {
        path: '/product-reviews/:id/update',
        name: 'product-reviews.update',
        component: resolve(__dirname, '../pages/update.vue'),
    },
];
