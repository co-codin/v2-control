export const systemFilters = [
    {
        name_ru: 'Статус',
        name: 'status',
        type: 'terms',
        availableValues: [
            {
                text: 'Активные товары',
                value: 1,
            },
            {
                text: 'Скрытые товары',
                value: 2,
            },
            {
                text: 'Товары, доступные по URL',
                value: 3,
            },
        ],
    },
    {
        name_ru: 'Производитель',
        name: 'brand',
        type: 'terms',
    },
    {
        name_ru: 'Корневая категория',
        name: 'root_category',
        type: 'terms',
    },
    {
        name_ru: 'Категория',
        name: 'category',
        type: 'terms',
    },
    {
        name_ru: 'Категории товара',
        name: 'categories',
        type: 'terms',
    },
    {
        name_ru: 'Плашка',
        name: 'stock_type',
        type: 'terms',
    },
    {
        name_ru: 'Страна производителя',
        name: 'brand.country',
        type: 'terms',
    },
    {
        name_ru: 'Цена в рублях',
        name: 'price_in_rub',
        path: 'variations',
        type: 'range',
        allowedValues: [
            {
                text: 'От',
                value: 'gte',
            },
            {
                text: 'До',
                value: 'lte',
            },
        ],
    },
    {
        name_ru: 'Модификация доступна',
        name: 'is_enabled',
        path: 'variations',
        type: 'terms',
        allowedValues: [
            {
                text: 'Да',
                value: 1,
            },
            {
                text: 'Нет',
                value: 0,
            },
        ],
    },
    {
        name_ru: 'Цена отображается',
        name: 'is_price_visible',
        path: 'variations',
        type: 'terms',
        allowedValues: [
            {
                text: 'Да',
                value: 1,
            },
            {
                text: 'Нет',
                value: 0,
            },
        ],
    },
    {
        name_ru: 'Наличие',
        name: 'availability',
        path: 'variations',
        type: 'terms',
        allowedValues: [
            {
                text: 'В наличии',
                value: 1,
            },
            {
                text: 'Под заказ',
                value: 2,
            },
            {
                text: 'Ожидается поступление',
                value: 3,
            },
            {
                text: 'Снято с производства',
                value: 4,
            },
            {
                text: 'Отсутствует регистрационное удостоверение',
                value: 5,
            },
        ],
    },
    {
        name_ru: 'По акции',
        name: 'is_hot',
        path: 'variations',
        type: 'terms',
        allowedValues: [
            {
                text: 'Да',
                value: 1,
            },
            {
                text: 'Нет',
                value: 0,
            },
        ],
    },
    {
        name_ru: 'Состояние',
        name: 'condition',
        path: 'variations',
        type: 'terms',
    },
];
