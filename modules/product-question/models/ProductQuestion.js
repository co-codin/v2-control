import Model from '@/models/Model';

export default class ProductQuestion extends Model {
    resource() {
        return 'product-questions';
    }

    get isApproved() {
        return (this.status?.value ?? this.status) === 2;
    }

    get isRejected() {
        return (this.status?.value ?? this.status) === 3;
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

    get clientName () {
        const client = this.client ?? this;
        return `${client.first_name ?? ""} ${client.last_name ?? ""}`;
    }

    approve() {
        return this.$http.put(`/admin/product-questions/${this.id}/approve`, {
            comment: 'Вопрос к товару прошел проверку'
        });
    }

    reject() {
        return this.$http.put(`/admin/product-questions/${this.id}/reject`, {
            comment: 'Вопрос к товару не прошел проверку'
        });
    }
}
