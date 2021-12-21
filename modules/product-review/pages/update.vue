<template>
    <div>
        <page-header h1="Редактирование отзыва" :breadcrumbs="breadcrumbs" />
        <template v-if="!$fetchState.pending">
            <v-expansion-panels :value="0">
                <form-block title="Основная информация">
                    <product-review-form
                        :review="review"
                        is-updating
                        @send="updateProductReview"
                    />
                </form-block>
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
import ProductReviewForm from '../components/ProductReviewForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';
import ProductReview from "~/modules/product-review/models/ProductReview";

export default {
    components: {
        FormBlock,
        PageHeader,
        ProductReviewForm,
    },
    data: () => ({
        review: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Список отзывов к товарам', to: { name: 'product-reviews.index' } },
            { text: 'Редактирование отзыва' },
        ],
    }),
    async fetch() {
        this.review = await ProductReview.$find(this.$route.params.id);
        this.review.experience = this.review.experience.value;
        this.review.status = this.review.status.value;
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование отзыва',
    },
    methods: {
        async updateProductReview(form) {
            try {
                await form.put(`/admin/product-reviews/${this.review.id}`);
                this.$snackbar(`Отзыв успешно обновлен`);
                await this.$router.push({ name: 'product-reviews.index' });
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении отзыва: ${e.message}`);
            }
        },
    },
};
</script>
