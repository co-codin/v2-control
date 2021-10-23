const page = (path) => () =>
    import(/* webpackChunkName: "filter-[request]" */ `../pages/${path}.vue`).then((m) => m.default || m);

export default [
    {
        path: '/filters',
        name: 'filters.index',
        component: page('index'),
    },
    {
        path: '/filters/create',
        name: 'filters.create',
        component: page('create'),
    },
    {
        path: '/filters/:id/update',
        name: 'filters.update',
        component: page('update'),
    },
];
