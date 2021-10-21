const page = (path) => () =>
    import(/* webpackChunkName: "achievement-[request]" */ `../pages/${path}.vue`).then((m) => m.default || m);

export default [
    {
        path: '/achievements',
        name: 'achievements.index',
        component: page('index'),
    },
    {
        path: '/achievements/create',
        name: 'achievements.create',
        component: page('create'),
    },
    {
        path: '/achievements/:id/update',
        name: 'achievements.update',
        component: page('update'),
    },
];
