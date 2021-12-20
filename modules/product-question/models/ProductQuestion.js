import Model from '@/models/Model';

export default class ProductQuestion extends Model {
    resource() {
        return 'product-questions';
    }

    get isApproved() {
        return this.status.value === 2;
    }

    get isRejected() {
        return this.status.value === 3;
    }

    get color () {
        switch (this.status.value) {
            case 2:
                return 'green';
            case 3:
                return 'red';
            default:
                return 'orange';
        }
    }
}
