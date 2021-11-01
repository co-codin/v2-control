export const questionCategoryRoutes = (resolve) => [
    {
        path: '/question-categories',
        name: 'question-categories.index',
        component: resolve(__dirname, '../pages/index.vue'),
    },
    {
        path: '/question-categories/create',
        name: 'question-categories.create',
        component: resolve(__dirname, '../pages/create.vue'),
    },
    {
        path: '/question-categories/:id/update',
        name: 'question-categories.update',
        component: resolve(__dirname, '../pages/update.vue'),
    },
];
