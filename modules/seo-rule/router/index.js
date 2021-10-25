export const seoRuleRoutes = (resolve) => [
    {
        path: '/seo-rules',
        name: 'seo-rules.index',
        component: resolve(__dirname, '../pages/index.vue'),
    },
    {
        path: '/seo-rules/create',
        name: 'seo-rules.create',
        component: resolve(__dirname, '../pages/create.vue'),
    },
    {
        path: '/seo-rules/:id/update',
        name: 'seo-rules.update',
        component: resolve(__dirname, '../pages/update.vue'),
    },
];
