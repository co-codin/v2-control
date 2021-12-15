<template>
    <div>
        <page-header h1="Добавление отзыва" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <form-block title="Основная информация">
                <customer-review-form @send="createCustomerReview" />
            </form-block>
        </v-expansion-panels>
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
        breadcrumbs: [
            { text: 'Список отзывов к товарам', to: { name: 'product-reviews.index' } },
            { text: 'Добавление отзыва' },
        ],
    }),
    head: {
        title: 'Добавление отзыва',
    },
    methods: {
        async createCustomerReview(form) {
            try {
                await form.post('/admin/customer-reviews');
                this.$snackbar(`Отзыв успешно добавлен`);
                await this.$router.push({ name: 'customer-reviews.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании отзыва: ${e.message}`);
            }
        },
    },
};
</script>
