export const contactRoutes = (resolve) => [
    {
        path: '/contacts',
        name: 'contacts.index',
        component: resolve(__dirname, '../pages/index.vue'),
    },
    {
        path: '/contacts/create',
        name: 'contacts.create',
        component: resolve(__dirname, '../pages/create.vue'),
    },
    {
        path: '/contacts/:id/update',
        name: 'contacts.update',
        component: resolve(__dirname, '../pages/update.vue'),
    },
    {
        path: '/contacts/sort',
        name: 'contacts.sort',
        component: resolve(__dirname, '../pages/sort.vue'),
    },
];
