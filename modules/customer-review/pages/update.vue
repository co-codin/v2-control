<template>
    <div>
        <page-header h1="Редактирование производителя" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels v-if="customer_review">
            <customer-review-form :customer-review="customer_review" is-updating @send="updateCustomerReview" />
        </v-expansion-panels>
    </div>
</template>

<script>
import CustomerReviewForm from '../components/CustomerReviewForm';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        PageHeader,
        CustomerReviewForm,
    },
    data: () => ({
        customer_review: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список отзывов', href: '/customer-reviews' },
            { text: 'Редактирование отзыва' },
        ],
    }),
    async fetch() {
        const { data } = await this.$axios.get(`/customer-reviews/${this.$route.params.id}`);
        this.customer_review = data.data;
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование отзыва',
    },
    methods: {
        async updateCustomerReview(form) {
            try {
                await form.put(`/admin/customer-reviews/${this.$route.params.id}`);
                this.$snackbar(`Отзыв успешно обновлен`);
                await this.$router.push({ name: 'customer-reviews.index' });
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении отзыва: ${e.message}`);
            }
        },
    },
};
</script>
