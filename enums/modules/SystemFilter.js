export const systemFilters = [
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
        name_ru: 'Страна производства',
        name: 'product.country',
        type: 'terms',
    },
    {
        name_ru: 'Цена в рублях',
        name: 'price_in_rub',
        path: 'variations',
        type: 'range',
        is_numeric: true,
    },
    {
        name_ru: 'Наличие',
        name: 'availability',
        path: 'variations',
        type: 'terms',
    },
    {
        name_ru: 'По акции',
        name: 'is_hot',
        path: 'variations',
        type: 'terms',
    },
    {
        name_ru: 'Состояние',
        name: 'condition',
        path: 'variations',
        type: 'terms',
    },
];
