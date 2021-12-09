<template>
    <div>
        <page-header h1="Отзывы к товарам" :breadcrumbs="breadcrumbs" />

        <advanced-search-form fast-filter-name="live" :filters="filters" :value="searchForm" @search="search" />

        <v-card>
            <v-data-table
                v-model="selectedItems"
                item-key="id"
                :headers="headers"
                :items="product_reviews"
                :loading="isLoading"
                :server-items-length="total"
                loading-text="Идет загрузка..."
                :options.sync="tableOptions"
                :footer-props="tableFooterProps"
                show-select
                @update:items-per-page="updateOptions('itemsPerPage', $event)"
                @update:page="updateOptions('page', $event)"
                @update:sort-by="updateOptions('sortBy', $event)"
                @update:sort-desc="updateOptions('sortDesc', $event)"
            >
                <template #item.id="{ item }">
                    <div class="font-weight-bold text-no-wrap"># {{ item.id }}</div>
                </template>

                <template #item.author="{ item }">
                    <div>
                        <template v-if="item.client.first_name">
                            {{ item.client.first_name }}
                        </template>
                        <template v-if="item.client.last_name">
                            {{ item.client.last_name }}
                        </template>
                    </div>
                </template>

                <template #item.created_at="{ item }">
                    <div>{{ item.asDate('created_at').fromNow() }}</div>
                </template>

                <template #item.status="{ item }">
                    <v-chip small :color="item.color" dark>{{ item.status.description }}</v-chip>
                </template>

                <template #item.product_id="{ item }">
                    <div>
                        {{ item.product.brand.name }} {{ item.product.name }}
                        <v-btn
                            icon
                            width="22"
                            height="22"
                            target="_blank"
                            link
                            :href="`${$config.app.siteUrl}/product/${item.product.slug}/${item.product.id}`"
                        >
                            <external-link-icon class="h-6 w-6" />
                        </v-btn>
                    </div>
                </template>

                <template #item.action="{ item }">
                    <div class="actions text-no-wrap">
                        <v-btn
                            v-if="!item.isApproved"
                            icon
                            width="22"
                            height="22"
                            class="mx-1"
                            @click="approveReview(item)"
                        >
                            <check-circle-icon class="h-6 w-6" />
                        </v-btn>
                        <v-btn
                            v-if="!item.isRejected"
                            icon
                            width="22"
                            height="22"
                            class="mr-1"
                            @click="rejectReview(item)"
                        >
                            <x-circle-icon class="h-6 w-6" />
                        </v-btn>
<!--                        <v-btn-->
<!--                            icon-->
<!--                            width="22"-->
<!--                            height="22"-->
<!--                            class="mx-1"-->
<!--                            :to="{ name: 'product-reviews.update', params: { id: item.id } }"-->
<!--                        >-->
<!--                            <pencil-alt-icon class="h-6 w-6" />-->
<!--                        </v-btn>-->
                        <v-btn icon width="22" height="22" @click.prevent="deleteProductReview(item)">
                            <trash-icon class="h-6 w-6" />
                        </v-btn>
                    </div>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script>
import DatatableMixin from '@/mixins/datatable';
import AdvancedSearchForm from '@/components/search/AdvancedSearchForm';
import ProductReview from '../models/ProductReview';
import PageHeader from '~/components/common/PageHeader';
import {productReviewStatusLabels} from "~/enums";
import CheckCircleIcon from '~/components/heroicons/CheckCircleIcon';
import XCircleIcon from '~/components/heroicons/XCircleIcon';

export default {
    components: {
        PageHeader,
        AdvancedSearchForm,
        CheckCircleIcon,
        XCircleIcon,
    },
    mixins: [DatatableMixin],
    data() {
        return {
            product_reviews: [],
            searchForm: {
                live: null,
                id: null,
                status: null,
            },
            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Автор', align: 'left', value: 'author' },
                { text: 'Товар', align: 'left', value: 'product_id' },
                { text: 'Статус', value: 'status' },
                { text: 'Дата создания', align: 'left', value: 'created_at' },
                { text: '', sortable: false, align: 'right', value: 'action' },
            ],
            breadcrumbs: [{ text: 'Главная', href: '/' }, { text: 'Отзывы к товарам' }],
            filters: [
                {
                    label: 'Быстрый поиск',
                    name: 'live',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'ID',
                    name: 'id',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'Статус',
                    name: 'status',
                    component: () => import('@/components/search/fields/SelectSearchField'),
                    items: productReviewStatusLabels,
                },
            ],
        };
    },
    async fetch() {
        this.showLoading();
        const response = await ProductReview.params(this.queryParams).with(['client', 'product', 'product.brand']).get();
        this.product_reviews = ProductReview.hydrate(response.data);
        this.setTotal(response.meta.total);
        this.hideLoading();
    },
    head: {
        title: 'Отзывы к товарам',
    },
    methods: {
        async deleteProductReview(product_review) {
            if (!(await this.$confirm(`Вы действительно хотите удалить отзыв?`))) {
                return;
            }
            try {
                await product_review.delete();

                this.$snackbar(`Отзыв успешно удален`);
                this.product_reviews = this.product_reviews.filter((item) => item.id !== product_review.id);
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
        async approveReview(review) {
            if (!(await this.$confirm(`Вы действительно хотите одобрить отзыв?`))) {
                return;
            }
            try {
                await this.$axios.put(`/admin/product-reviews/${review.id}/approve`, {
                    comment: 'Отзыв прошел проверку'
                });
                this.$snackbar(`Отзыв успешно одобрен`);
                this.$fetch();
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
        async rejectReview(review) {
            if (!(await this.$confirm(`Вы действительно хотите отклонить отзыв?`))) {
                return;
            }
            try {
                await this.$axios.put(`/admin/product-reviews/${review.id}/reject`, {
                    comment: 'Отзыв не прошел проверку'
                });
                this.$snackbar(`Отзыв успешно отклонен`);
                this.$fetch();
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
