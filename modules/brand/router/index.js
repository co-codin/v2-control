export const brandRoutes = (resolve) => [
  {
    path: '/brands',
    name: 'brands.index',
    component: resolve(__dirname, '../pages/index.vue'),
  },
  {
    path: '/brands/create',
    name: 'brands.create',
    component: resolve(__dirname, '../pages/create.vue'),
  },
  {
    path: '/brands/:id/update',
    name: 'brands.update',
    component: resolve(__dirname, '../pages/update.vue'),
  },
];
