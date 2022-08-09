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
                { icon: 'collection', text: 'Товары', link: '/products', permission: 'view products' },
                { icon: 'color-swatch', text: 'Категории', link: '/categories', permission: 'view categories' },
                { icon: 'cog', text: 'Производители', link: '/brands', permission: 'view brands' },
                { icon: 'characters', text: 'Характеристики', link: '/properties', permission: 'view properties' },
                { icon: 'cube', text: 'Значения характеристик', link: '/field-values', permission: 'view field values' },
                { icon: 'adjustments', text: 'Фильтры', link: '/filters', permission: 'view filters' },
                { icon: 'dollar', text: 'Валюты', link: '/currencies', permission: 'view currencies' },
                { icon: 'export', text: 'Экспорты', link: '/exports', permission: 'view exports' },
                { icon: 'adjustments', text: 'Атрибуты', link: '/attributes', permission: 'view attributes' },
                { icon: 'annotation', text: 'Отзывы к товарам', link: '/product-reviews', badge: 'product-reviews', permission: 'view product reviews' },
                { icon: 'question', text: 'Вопросы к товарам', link: '/product-questions', badge: 'product-questions', permission: 'view product questions' },
            ],
        },
        {
            text: 'Контент',
            items: [
                { icon: 'news', text: 'Новости', link: '/news', permission: 'view news' },
                { icon: 'document-text', text: 'Страницы', link: '/pages', permission: 'view pages' },
                { icon: 'publication', text: 'Публикации', link: '/publications', permission: 'view publications' },
                { icon: 'achievement', text: 'Достижения', link: '/achievements', permission: 'view achievements' },
                { icon: 'review', text: 'Отзывы', link: '/customer-reviews', permission: 'view customer reviews' },
                { icon: 'chat', text: 'Вопросы и ответы', link: '/questions', permission: 'view questions' },
                { icon: 'vacancy', text: 'Вакансии', link: '/vacancies', permission: 'view vacancies' },
                { icon: 'cabinet', text: 'Кабинеты', link: '/cabinets', permission: 'view cabinets' },
                { icon: 'case', text: 'Кейсы', link: '/cases', permission: 'view cases' },
                { icon: 'banner', text: 'Баннеры', link: '/banners', permission: 'view banners' },
                { icon: 'contact', text: 'Контакты', link: '/contacts', permission: 'view contacts' },
                { icon: 'journal', text: 'Журнала событий', link: '/activities', permission: 'view activities' },
            ],
        },
        {
            text: 'SEO',
            items: [
                { icon: 'seo', text: 'SEO правила', link: '/seo-rules', permission: 'view seo rules' },
                { icon: 'redirect', text: 'Редиректы', link: '/redirects', permission: 'view redirects' },
                { icon: 'canonical', text: 'Канонические ссылки', link: '/canonicals', permission: 'view canonicals' },
            ],
        },
        {
            text: 'Сотрудники',
            items: [
                { icon: 'user', text: 'Сотрудники', link: '/users', permission: 'view users' },
                { icon: 'database', text: 'Роли', link: '/roles', permission: 'view roles' },
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
