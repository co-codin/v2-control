import Model from '@/models/Model';

export default class CustomerReview extends Model {
    resource() {
        return 'customer-reviews';
    }

    get isInHomeLabel() {
        return this.is_in_home ? 'Да' : 'Нет';
    }
}
