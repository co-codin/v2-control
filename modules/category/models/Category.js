import Model from '@/models/Model';

export default class Category extends Model {
    resource() {
        return 'categories';
    }

    get ancestorsPath() {
        return this.ancestors?.map((ancestor) => ancestor.name).join('&raquo;');
    }
}
