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
                { icon: 'mdi-cash-usd-outline', text: 'Значения характеристик', link: '/field-values' },
                { icon: 'mdi-cash-usd-outline', text: 'Фильтры', link: '/filters' },
                { icon: 'mdi-cash-usd-outline', text: 'Валюты', link: '/currencies' },
                { icon: 'mdi-cash-usd-outline', text: 'Экспорты', link: '/exports' },
                { icon: 'mdi-cash-usd-outline', text: 'Атрибуты', link: '/attributes' },
                {
                    icon: 'mdi-cash-usd-outline',
                    text: 'Отзывы к товарам',
                    link: '/product-reviews',
                    badge: 'product-reviews',
                },
                {
                    icon: 'mdi-cash-usd-outline',
                    text: 'Вопросы к товарам',
                    link: '/product-questions',
                    badge: 'product-questions',
                },
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
                { icon: 'mdi-cash-usd-outline', text: 'Вопросы и ответы', link: '/questions' },
                { icon: 'mdi-cash-usd-outline', text: 'Вакансии', link: '/vacancies' },
                { icon: 'mdi-cash-usd-outline', text: 'Кабинеты', link: '/cabinets' },
                { icon: 'mdi-cash-usd-outline', text: 'Проекты', link: '/cases' },
                { icon: 'mdi-cash-usd-outline', text: 'Баннеры', link: '/banners' },
            ],
        },
        {
            text: 'SEO',
            items: [
                { icon: 'mdi-cash-usd-outline', text: 'SEO правила', link: '/seo-rules' },
                { icon: 'mdi-cash-usd-outline', text: 'Редиректы', link: '/redirects' },
                { icon: 'mdi-cash-usd-outline', text: 'Канонические ссылки', link: '/canonicals' },
            ],
        },
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
