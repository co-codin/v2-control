import config from './config';
import { brandRoutes } from './modules/brand/router';
import { categoryRoutes } from './modules/category/router';
import { productRoutes } from './modules/product/router';
import { propertyRoutes } from './modules/property/router';
import { filterRoutes } from './modules/filter/router';
import { seoRuleRoutes } from './modules/seo-rule/router';
import { cityRoutes } from './modules/city/router';
import { newsRoutes } from './modules/news/router';
import { achievementRoutes } from './modules/achievement/router';
import { publicationRoutes } from './modules/publication/router';
import { customerReviewRoutes } from './modules/customer-review/router';
import { redirectRoutes } from './modules/redirect/router';
import { pageRoutes } from './modules/page/router';
import { currencyRoutes } from './modules/currency/router';
import { questionCategoryRoutes } from './modules/question-category/router';
import { questionsRoutes } from './modules/question/router';
import { vacancyRoutes } from './modules/vacancy/router';
import { exportRoutes } from './modules/export/router';
import { attributeRoutes } from './modules/attribute/router';
import { canonicalRoutes } from './modules/canonical/router';
import { cabinetRoutes } from './modules/cabinet/router';
import { productReviewRoutes } from './modules/product-review/router';
import { fieldValueRoutes } from './modules/field-value/router';
import { productQuestionRoutes } from './modules/product-question/router';
import { caseRoutes } from './modules/case/router';
import { toolRoutes } from './modules/tool/router';
import { bannerRoutes } from './modules/banner/router';
import { contactRoutes } from './modules/contact/router';
import { roleRoutes } from './modules/role/router'
import { userRoutes } from './modules/user/router'
import {activityRoutes} from './modules/activity/router'

export default {
    ssr: false,

    head: {
        titleTemplate: '%s - MEDEQ',
        title: 'nuxt',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' },
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            ...config.icons.map((href) => ({ rel: 'stylesheet', href })),
        ],
    },

    css: ['~/assets/scss/theme.scss'],

    plugins: [
        { src: '~/plugins/animate.js' },
        { src: '~/plugins/clipboard.js' },
        { src: '~/plugins/vue-shortkey.js' },
        { src: '~/plugins/confirm/plugin.js' },
        { src: '~/plugins/tooltip.js' },
        { src: '~/plugins/snackbar/plugin.js' },
        { src: '~/plugins/portal.js' },
        { src: '~/filters/capitalize.js' },
        { src: '~/filters/lowercase.js' },
        { src: '~/filters/uppercase.js' },
        { src: '~/filters/formatCurrency.js' },
        { src: '~plugins/vue-api-query' },
        { src: '~plugins/directives/digits-only' },
        { src: '~plugins/dayjs' },
        { src: '~plugins/random-person' },
        { src: '~plugins/enum/plugin' },
        { src: '~plugins/permissions' },
    ],

    buildModules: ['@nuxtjs/vuetify', '@nuxtjs/dotenv', '@nuxtjs/router'],

    modules: ['@nuxtjs/axios', '@nuxtjs/auth', '@nuxtjs/svg'],

    auth: {
        localStorage: false,
        strategies: {
            local: {
                endpoints: {
                    login: { url: `/admin/auth/login`, method: 'post', propertyName: 'token' },
                    logout: { url: `/admin/auth/logout`, method: 'post' },
                    user: { url: `/admin/auth/user`, method: 'get', propertyName: 'data' },
                },
            },
        },
        cookie: {
            prefix: 'controlauth.',
            options: {
                expires: 183,
            },
        },
    },

    vuetify: {
        customVariables: ['~/assets/scss/vuetify/variables/_index.scss'],
        optionsPath: '~/config/vuetify.js',
        treeShake: true,
        defaultAssets: {
            font: false,
        },
    },

    axios: {
        baseURL: process.env.API_URL,
    },

    publicRuntimeConfig: {
        axios: {
            baseURL: process.env.API_URL,
        },
        ...config,
    },

    build: {},

    router: {
        prefetchLinks: false,
        middleware: ['auth', 'permissions', 'load-all-categories', 'load-all-enums'],
        trailingSlash: false,
        extendRoutes(routes, resolve) {
            routes.splice(0, routes.length);
            routes.push(
                ...[
                    {
                        path: '/',
                        name: 'home',
                        component: resolve(__dirname, '_pages/home.vue'),
                    },
                    {
                        path: '/login',
                        name: 'login',
                        component: resolve(__dirname, '_pages/login.vue'),
                    },
                    {
                        path: '/search',
                        name: 'search',
                        component: resolve(__dirname, '_pages/search.vue'),
                    },
                    ...brandRoutes(resolve),
                    ...categoryRoutes(resolve),
                    ...productRoutes(resolve),
                    ...propertyRoutes(resolve),
                    ...filterRoutes(resolve),
                    ...cityRoutes(resolve),
                    ...newsRoutes(resolve),
                    ...seoRuleRoutes(resolve),
                    ...achievementRoutes(resolve),
                    ...publicationRoutes(resolve),
                    ...customerReviewRoutes(resolve),
                    ...redirectRoutes(resolve),
                    ...pageRoutes(resolve),
                    ...currencyRoutes(resolve),
                    ...questionCategoryRoutes(resolve),
                    ...questionsRoutes(resolve),
                    ...vacancyRoutes(resolve),
                    ...exportRoutes(resolve),
                    ...attributeRoutes(resolve),
                    ...canonicalRoutes(resolve),
                    ...cabinetRoutes(resolve),
                    ...productReviewRoutes(resolve),
                    ...fieldValueRoutes(resolve),
                    ...productQuestionRoutes(resolve),
                    ...caseRoutes(resolve),
                    ...toolRoutes(resolve),
                    ...bannerRoutes(resolve),
                    ...contactRoutes(resolve),
                    ...roleRoutes(resolve),
                    ...userRoutes(resolve),
                    ...activityRoutes(resolve),
                ]
            );
        },
    },
};
