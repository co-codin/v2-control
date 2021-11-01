export const questionsRoutes = (resolve) => [
    {
        path: '/questions',
        name: 'questions.index',
        component: resolve(__dirname, '../pages/index.vue'),
    },
    {
        path: '/questions/create',
        name: 'questions.create',
        component: resolve(__dirname, '../pages/create.vue'),
    },
    {
        path: '/questions/:id/update',
        name: 'questions.update',
        component: resolve(__dirname, '../pages/update.vue'),
    },
];
