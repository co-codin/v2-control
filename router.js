import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const page = (path) => () => import(/* webpackChunkName: "[request]" */ `~/pages/${path}.vue`).then((m) => m.default || m);

function loadModules() {

  const context = require.context('@/modules', true, /router\/index.js$/i);
  const context_arr = context.keys().map(context).map((m) => m.default);

  const routes = [];

  if (context_arr.length) {
    context_arr.forEach((route) => {
      routes.push(...route);
    });
  }

  return routes;
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: page('index'),
  },
  ...loadModules(),
];

const router = new Router({
  routes,
  mode: 'history',
});

export function createRouter() {
  return router;
}
