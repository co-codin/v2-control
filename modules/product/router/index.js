const page = (path) => () =>
    import(/* webpackChunkName: "product-[request]" */ `../pages/${path}.vue`).then((m) => m.default || m);

export default [
    {
        path: '/products',
        name: 'products.index',
        component: page('index'),
    },
    {
        path: '/products/create',
        name: 'products.create',
        component: page('create'),
    },
    {
        path: '/products/:id/update',
        name: 'products.update',
        component: page('update'),
    },
];
