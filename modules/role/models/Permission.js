import Model from '@/models/Model';

export default class Permission extends Model {
    resource() {
        return 'admin/permissions'
    }
}
