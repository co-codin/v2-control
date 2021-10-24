import Model from '@/models/Model';

export default class Product extends Model {
    // eslint-disable-next-line class-methods-use-this
    resource() {
        return 'products';
    }

    get fullName() {
        return `${this.brand?.name} ${this.name}`;
    }
}
