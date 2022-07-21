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
        {
            text: 'Контент',
            items: [
                { icon: 'document-text', text: 'Новости', link: '/news' },
                { icon: 'document-text', text: 'Страницы', link: '/pages' },
                { icon: 'document-text', text: 'Публикации', link: '/publications' },
                { icon: 'document-text', text: 'Достижения', link: '/achievements' },
                { icon: 'document-text', text: 'Отзывы', link: '/customer-reviews' },
                { icon: 'document-text', text: 'Вопросы и ответы', link: '/questions' },
                { icon: 'document-text', text: 'Вакансии', link: '/vacancies' },
                { icon: 'document-text', text: 'Кабинеты', link: '/cabinets' },
                { icon: 'document-text', text: 'Проекты', link: '/cases' },
                { icon: 'document-text', text: 'Баннеры', link: '/banners' },
                { icon: 'document-text', text: 'Контакты', link: '/contacts' },
            ],
        },
        {
            text: 'SEO',
            items: [
                { icon: 'document-search', text: 'SEO правила', link: '/seo-rules' },
                { icon: 'document-search', text: 'Редиректы', link: '/redirects' },
                { icon: 'document-search', text: 'Канонические ссылки', link: '/canonicals' },
            ],
        },
        {
            text: 'Права доступа',
            items: [
                { icon: 'database', text: 'роли', link: '/roles' },
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
