export const vacancyRoutes = (resolve) => [
    {
        path: '/vacancies',
        name: 'vacancies.index',
        component: resolve(__dirname, '../pages/index.vue'),
    },
    {
        path: '/vacancies/create',
        name: 'vacancies.create',
        component: resolve(__dirname, '../pages/create.vue'),
    },
    {
        path: '/vacancies/:id/update',
        name: 'vacancies.update',
        component: resolve(__dirname, '../pages/update.vue'),
    },
];
