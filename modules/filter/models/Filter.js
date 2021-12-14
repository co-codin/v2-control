import Model from '@/models/Model';

export default class Filter extends Model {
    resource() {
        return 'filters';
    }

    get fullCategoryPath() {
        if(!this.category) {
            return null;
        }
        return ([...this.category.ancestors ?? []])
            .sort((a, b) => a._lft - b._lft)
            .map(ancestor => ancestor.name)
            .concat([this.category?.name])
            .join('<br>');
    }
}
