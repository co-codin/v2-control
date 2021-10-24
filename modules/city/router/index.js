const page = (path) => () =>
    import(/* webpackChunkName: "city-[request]" */ `../pages/${path}.vue`).then((m) => m.default || m);

export default [
    {
        path: '/cities',
        name: 'cities.index',
        component: page('index'),
    },
    {
        path: '/cities/create',
        name: 'cities.create',
        component: page('create'),
    },
    {
        path: '/cities/:id/update',
        name: 'cities.update',
        component: page('update'),
    },
];
