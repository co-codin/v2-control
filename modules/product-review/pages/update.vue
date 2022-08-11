<template>
    <div>
        <page-header h1="Редактирование отзыва" :breadcrumbs="breadcrumbs" />
        <template v-if="!$fetchState.pending">
            <div v-if="$can('edit product reviews')" class="mb-2">
                <v-btn v-if="!review.isApproved" color="green" outlined small @click="approveReview(review)">
                    <check-circle-icon class="h-6 w-6 mr-1" />
                    Одобрить
                </v-btn>
                <v-btn v-if="!review.isRejected" color="red" outlined small @click="rejectReview(review)">
                    <x-circle-icon class="h-6 w-6 mr-1" />
                    Отклонить
                </v-btn>
            </div>
            <v-expansion-panels :value="0">
                <form-block title="Основная информация">
                    <product-review-form :review="review" is-updating @send="updateProductReview" />
                </form-block>
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
import ProductReviewForm from '../components/ProductReviewForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';
import ProductReview from '~/modules/product-review/models/ProductReview';
import CheckCircleIcon from '~/components/heroicons/CheckCircleIcon';
import XCircleIcon from '~/components/heroicons/XCircleIcon';

export default {
    components: {
        FormBlock,
        PageHeader,
        ProductReviewForm,
        CheckCircleIcon,
        XCircleIcon,
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
                await this.$nuxt.refresh();
            } catch (e) {
                this.$snackbar(`Произошла ошибка при обновлении отзыва: ${e.message}`);
            }
        },
        async approveReview(review) {
            if (!(await this.$confirm(`Вы действительно хотите одобрить отзыв?`))) {
                return;
            }
            try {
                await review.approve();
                this.$snackbar(`Отзыв успешно одобрен`);
                await this.$nuxt.refresh();
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
        async rejectReview(review) {
            if (!(await this.$confirm(`Вы действительно хотите отклонить отзыв?`))) {
                return;
            }
            try {
                await review.reject();
                this.$snackbar(`Отзыв успешно отклонен`);
                await this.$nuxt.refresh();
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
