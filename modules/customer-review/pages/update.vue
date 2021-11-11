<template>
    <div>
        <page-header h1="Редактирование отзыва" :breadcrumbs="breadcrumbs" />
        <template v-if="!$fetchState.pending">
            <v-expansion-panels>
                <form-block title="Основная информация">
                    <customer-review-form :customer-review="customer_review" is-updating @send="updateCustomerReview" />
                </form-block>
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
import CustomerReviewForm from '../components/CustomerReviewForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
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
