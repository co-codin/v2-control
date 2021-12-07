export const cabinetRoutes = (resolve) => [
    {
        path: '/cabinets',
        name: 'cabinets.index',
        component: resolve(__dirname, '../pages/index.vue'),
    },
    {
        path: '/cabinets/create',
        name: 'cabinets.create',
        component: resolve(__dirname, '../pages/create.vue'),
    },
    {
        path: '/cabinets/:id/update',
        name: 'cabinets.update',
        component: resolve(__dirname, '../pages/update.vue'),
    },
];
