<template>
    <div>
        <page-header h1="Добавление отзыва" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <form-block title="Основная информация">
                <product-review-form @send="createReview" />
            </form-block>
        </v-expansion-panels>
    </div>
</template>

<script>
import ProductReviewForm from "~/modules/product-review/components/ProductReviewForm";
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        PageHeader,
        ProductReviewForm,
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
        async createReview(form) {
            try {
                const { data } = await form.post('/admin/product-reviews');
                this.$snackbar(`Отзыв успешно добавлен`);
                await this.$router.push({ name: 'product-reviews.update', params: { id: data.id } });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании отзыва: ${e.message}`);
            }
        },
    },
};
</script>
