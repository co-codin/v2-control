export default {
    menu: [
        {
            text: '',
            key: '',
            items: [
                { icon: 'mdi-view-dashboard-outline', key: 'menu.dashboard', text: 'Панель управления', link: '/' },
            ],
        },
        {
            text: 'Каталог',
            items: [
                { icon: 'mdi-cash-usd-outline', text: 'Товары', link: '/products' },
                { icon: 'mdi-cash-usd-outline', text: 'Категории', link: '/categories' },
                { icon: 'mdi-cash-usd-outline', text: 'Производители', link: '/brands' },
                { icon: 'mdi-cash-usd-outline', text: 'Характеристики', link: '/properties' },
                { icon: 'mdi-cash-usd-outline', text: 'Фильтры', link: '/filters' },
                { icon: 'mdi-cash-usd-outline', text: 'Валюты', link: '/currencies' },
            ],
        },
        {
            text: 'Контент',
            items: [
                { icon: 'mdi-cash-usd-outline', text: 'Новости', link: '/news' },
                { icon: 'mdi-cash-usd-outline', text: 'Страницы', link: '/pages' },
                { icon: 'mdi-cash-usd-outline', text: 'Публикации', link: '/publications' },
                { icon: 'mdi-cash-usd-outline', text: 'Достижения', link: '/achievements' },
                { icon: 'mdi-cash-usd-outline', text: 'Отзывы', link: '/customer-reviews' },
                { icon: 'mdi-cash-usd-outline', text: 'Категории вопросов', link: '/question-categories' },
                { icon: 'mdi-cash-usd-outline', text: 'Вопросы', link: '/questions' },
                { icon: 'mdi-cash-usd-outline', text: 'Вакансии', link: '/vacancies' },
                { icon: 'mdi-cash-usd-outline', text: 'Экспорт', link: '/exports' },
                { icon: 'mdi-cash-usd-outline', text: 'Атрибуты', link: '/attributes' },
            ],
        },
        {
            text: 'SEO',
            items: [
                { icon: 'mdi-cash-usd-outline', text: 'SEO правила', link: '/seo-rules' },
                { icon: 'mdi-cash-usd-outline', text: 'Редиректы', link: '/redirects' },
            ],
        },

        // {
        //   text: 'Каталог',
        //   items: [
        //     {
        //       icon: 'mdi-file-lock-outline',
        //       key: 'menu.auth',
        //       text: 'Auth Pages',
        //       regex: /^\/auth/,
        //       items: [
        //         { icon: 'mdi-file-outline', key: 'menu.authLogin', text: 'Signin / Login', link: '/auth/signin' },
        //         { icon: 'mdi-file-outline', key: 'menu.authRegister', text: 'Signup / Register', link: '/auth/signup' },
        //         { icon: 'mdi-file-outline', key: 'menu.authVerify', text: 'Verify Email', link: '/auth/verify-email' },
        //         { icon: 'mdi-file-outline', key: 'menu.authForgot', text: 'Forgot Password', link: '/auth/forgot-password' },
        //         { icon: 'mdi-file-outline', key: 'menu.authReset', text: 'Reset Password', link: '/auth/reset-password' }
        //       ]
        //     },
        //     { icon: 'mdi-file-cancel-outline', key: 'menu.errorPages', text: 'Error Pages', regex: /^\/error/,
        //       items: [
        //         { icon: 'mdi-file-outline', key: 'menu.errorNotFound', text: 'Not Found / 404', link: '/error/not-found' },
        //         { icon: 'mdi-file-outline', key: 'menu.errorUnexpected', text: 'Unexpected / 500', link: '/error/unexpected' }
        //       ]
        //     },
        //     { icon: 'mdi-file-cog-outline', key: 'menu.utilityPages', text: 'Utility Pages', regex: /^\/utility/,
        //       items: [
        //         { icon: 'mdi-file-outline', key: 'menu.utilityMaintenance', text: 'Maintenance', link: '/utility/maintenance' },
        //         { icon: 'mdi-file-outline', key: 'menu.utilitySoon', text: 'Coming Soon', link: '/utility/coming-soon' },
        //         { icon: 'mdi-file-outline', key: 'menu.utilityHelp', text: 'FAQs / Help', link: '/utility/help' }
        //       ]
        //     }
        //   ]
        // },
    ],

    footer: [
        // {
        //   text: 'Docs',
        //   key: 'menu.docs',
        //   href: 'https://vuetifyjs.com',
        //   target: '_blank'
        // }
    ],
};
