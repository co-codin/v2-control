const page = (path) => () =>
    import(/* webpackChunkName: "category-[request]" */ `../pages/${path}.vue`).then((m) => m.default || m);

export default [
    {
        path: '/categories',
        name: 'categories.index',
        component: page('index'),
    },
    {
        path: '/categories/create',
        name: 'categories.create',
        component: page('create'),
    },
    {
        path: '/categories/:id/update',
        name: 'categories.update',
        component: page('update'),
    },
];
