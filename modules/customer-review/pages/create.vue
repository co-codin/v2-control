<template>
    <div>
        <page-header h1="Добавление производителя" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <customer-review-form @send="createCustomerReview" />
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
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список отзывов', href: '/customer-reviews' },
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
                this.$snackbar(`Отзыв ${form.name} успешно добавлен`);
                await this.$router.push({ name: 'customer-reviews.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании отзыва: ${e.message}`);
            }
        },
    },
};
</script>
