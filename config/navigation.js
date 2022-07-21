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
                { icon: 'news', text: 'Новости', link: '/news' },
                { icon: 'document-text', text: 'Страницы', link: '/pages' },
                { icon: 'publication', text: 'Публикации', link: '/publications' },
                { icon: 'achievement', text: 'Достижения', link: '/achievements' },
                { icon: 'review', text: 'Отзывы', link: '/customer-reviews' },
                { icon: 'chat', text: 'Вопросы и ответы', link: '/questions' },
                { icon: 'vacancy', text: 'Вакансии', link: '/vacancies' },
                { icon: 'cabinet', text: 'Кабинеты', link: '/cabinets' },
                { icon: 'case', text: 'Проекты', link: '/cases' },
                { icon: 'banner', text: 'Баннеры', link: '/banners' },
                { icon: 'contact', text: 'Контакты', link: '/contacts' },
            ],
        },
        {
            text: 'SEO',
            items: [
                { icon: 'seo', text: 'SEO правила', link: '/seo-rules' },
                { icon: 'redirect', text: 'Редиректы', link: '/redirects' },
                { icon: 'canonical', text: 'Канонические ссылки', link: '/canonicals' },
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
