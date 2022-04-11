export const toolRoutes = (resolve) => [
    {
        path: '/tools',
        name: 'tools.index',
        component: resolve(__dirname, '../pages/index.vue'),
    },
    {
        path: '/tools/page-analyzer',
        name: 'tools.page-analyzer',
        component: resolve(__dirname, '../pages/page-analyzer.vue'),
    },
];
