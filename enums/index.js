import { enumToSelectArray } from './helpers';

import { Status, statusDescriptions, statusLabels, productReviewStatusLabels } from '~/enums/modules/Status';
import { type, typeLabels, typeDescriptions } from '~/enums/modules/Type';
import { Group, groupLabels, groupDescriptions } from '~/enums/modules/ProductGroup';
import { urlRules } from '~/enums/rules';

import { systemFilters } from '~/enums/modules/SystemFilter';

const uniqueContentList = [
    { value: 'booklet', text: 'Брошюра' },
    { value: 'video', text: 'Видеообзор' },
    { value: 'short_description', text: 'Короткое описание' },
    { value: 'full_description', text: 'Подробное описание' },
];

const exportTypeLabels = [
    { value: 1, text: 'TIU' },
    { value: 2, text: 'Google' },
    { value: 3, text: 'Facebook' },
    { value: 4, text: 'Авито' },
    { value: 5, text: 'PULS' },
    { value: 6, text: 'SATOM' },
];

const frequencyLabels = [
    { value: 1, text: 'Ручную' },
    { value: 2, text: 'Каждый 30 минут' },
    { value: 3, text: 'Каждый час' },
    { value: 4, text: 'Каждый 3 часа' },
    { value: 5, text: 'Каждый день' },
    { value: 6, text: 'Каждую неделю' },
];

export {
    Status,
    statusDescriptions,
    statusLabels,
    enumToSelectArray,
    uniqueContentList,
    exportTypeLabels,
    frequencyLabels,
    urlRules,
    type,
    typeLabels,
    typeDescriptions,
    Group,
    groupLabels,
    groupDescriptions,
    productReviewStatusLabels,
    systemFilters,
};
