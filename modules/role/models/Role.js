import Model from '@/models/Model';

export default class Role extends Model {
    resource() {
        return 'admin/roles';
    }
}
