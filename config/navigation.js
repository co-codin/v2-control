export default {
    menu: [
        {
            text: '',
            key: '',
            items: [
                { icon: 'device-tablet', key: 'menu.dashboard', text: 'Панель управления', link: '/' },
            ],
        },
        {
            text: 'Каталог',
            items: [
                { icon: 'collection', text: 'Товары', link: '/products' },
                { icon: 'color-swatch', text: 'Категории', link: '/categories' },
                { icon: 'cog', text: 'Производители', link: '/brands' },
                { icon: 'characters', text: 'Характеристики', link: '/properties' },
                { icon: 'cube', text: 'Значения характеристик', link: '/field-values' },
                { icon: 'adjustments', text: 'Фильтры', link: '/filters' },
                { icon: 'dollar', text: 'Валюты', link: '/currencies' },
                { icon: 'export', text: 'Экспорты', link: '/exports' },
                { icon: 'adjustments', text: 'Атрибуты', link: '/attributes' },
                {
                    icon: 'annotation',
                    text: 'Отзывы к товарам',
                    link: '/product-reviews',
                    badge: 'product-reviews',
                },
                {
                    icon: 'question',
                    text: 'Вопросы к товарам',
                    link: '/product-questions',
                    badge: 'product-questions',
                },
            ],
        },
        // {
        //     text: 'Контент',
        //     items: [
        //         { icon: 'mdi-cash-usd-outline', text: 'Новости', link: '/news' },
        //         { icon: 'mdi-cash-usd-outline', text: 'Страницы', link: '/pages' },
        //         { icon: 'mdi-cash-usd-outline', text: 'Публикации', link: '/publications' },
        //         { icon: 'mdi-cash-usd-outline', text: 'Достижения', link: '/achievements' },
        //         { icon: 'mdi-cash-usd-outline', text: 'Отзывы', link: '/customer-reviews' },
        //         { icon: 'mdi-cash-usd-outline', text: 'Вопросы и ответы', link: '/questions' },
        //         { icon: 'mdi-cash-usd-outline', text: 'Вакансии', link: '/vacancies' },
        //         { icon: 'mdi-cash-usd-outline', text: 'Кабинеты', link: '/cabinets' },
        //         { icon: 'mdi-cash-usd-outline', text: 'Проекты', link: '/cases' },
        //         { icon: 'mdi-cash-usd-outline', text: 'Баннеры', link: '/banners' },
        //         { icon: 'mdi-cash-usd-outline', text: 'Контакты', link: '/contacts' },
        //     ],
        // },
        // {
        //     text: 'SEO',
        //     items: [
        //         { icon: 'mdi-cash-usd-outline', text: 'SEO правила', link: '/seo-rules' },
        //         { icon: 'mdi-cash-usd-outline', text: 'Редиректы', link: '/redirects' },
        //         { icon: 'mdi-cash-usd-outline', text: 'Канонические ссылки', link: '/canonicals' },
        //     ],
        // },
        // {
        //     text: 'Права доступа',
        //     items: [
        //         { icon: 'mdi-cash-usd-outline', text: 'роли', link: '/roles' },
        //     ],
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
