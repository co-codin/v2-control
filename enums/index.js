import { enumToSelectArray } from './helpers';

import { Status, statusDescriptions, statusLabels } from '~/enums/modules/Status';

const uniqueContentList = [
    { value: 'booklet', text: 'Брошюра' },
    { value: 'video', text: 'Видеообзор' },
    { value: 'short_description', text: 'Короткое описание' },
    { value: 'full_description', text: 'Подробное описание' },
];

export { Status, statusDescriptions, statusLabels, enumToSelectArray, uniqueContentList };
