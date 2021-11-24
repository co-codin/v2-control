import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/ru';

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);

dayjs.locale('ru');

export default dayjs;
