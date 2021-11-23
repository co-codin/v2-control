import moment from 'moment';
import Model from '@/models/Model';

export default class Publication extends Model {
    asDate(field) {
        moment.locale('ru');
        return moment(this[field], 'DD-MM-YYYY');
    }

    resource() {
        return 'publications';
    }
}
