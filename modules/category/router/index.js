const page = (path) => () =>
    import(/* webpackChunkName: "category-[request]" */ `../pages/${path}.vue`).then((m) => m.default || m);

export default [
    {
        path: '/categories',
        name: 'categories.index',
        component: page('index'),
    },
];
