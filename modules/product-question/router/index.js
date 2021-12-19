export const productQuestionRoutes = (resolve) => [
    {
        path: '/product-questions',
        name: 'product-questions.index',
        component: resolve(__dirname, '../pages/index.vue'),
    },
    {
        path: '/product-questions/create',
        name: 'product-questions.create',
        component: resolve(__dirname, '../pages/create.vue'),
    },
    {
        path: '/product-questions/:id/update',
        name: 'product-questions.update',
        component: resolve(__dirname, '../pages/update.vue'),
    },
];
