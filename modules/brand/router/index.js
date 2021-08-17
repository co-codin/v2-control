const page = (path) => () =>
  import(/* webpackChunkName: "brand-[request]" */ `../pages/${path}.vue`).then((m) => m.default || m);

export default [
  {
    path: '/brands',
    name: 'brands.index',
    component: page('index'),
  },
  {
    path: '/brands/create',
    name: 'brands.create',
    component: page('create'),
  },
  {
    path: '/brands/:id/update',
    name: 'brands.update',
    component: page('update'),
  },
];
