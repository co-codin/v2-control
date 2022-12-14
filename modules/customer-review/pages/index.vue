<template>
    <div>
        <page-header h1="Отзывы" :breadcrumbs="breadcrumbs" />

        <div v-if="$can('create customer reviews')" class="mb-2">
            <v-btn :to="{ name: 'customer-reviews.create' }"> Добавить отзыв </v-btn>
        </div>

        <advanced-search-form :filters="filters" :value="searchForm" @search="search" />

        <v-card>
            <v-data-table
                v-model="selectedItems"
                item-key="id"
                :headers="headers"
                :items="customer_reviews"
                :loading="isLoading"
                :server-items-length="total"
                loading-text="Идет загрузка..."
                :options.sync="tableOptions"
                :footer-props="tableFooterProps"
                @update:items-per-page="updateOptions('itemsPerPage', $event)"
                @update:page="updateOptions('page', $event)"
                @update:sort-by="updateOptions('sortBy', $event)"
                @update:sort-desc="updateOptions('sortDesc', $event)"
            >
                <template #item.id="{ item }">
                    <div class="font-weight-bold text-no-wrap"># {{ item.id }}</div>
                </template>

                <template #item.created_at="{ item }">
                    <div>{{ item.asDate('created_at').fromNow() }}</div>
                </template>

                <template #item.action="{ item }">
                    <div class="table-actions">
                        <v-btn
                            v-if="$can('edit customer reviews')"
                            icon
                            width="22"
                            height="22"
                            class="mx-1"
                            :to="{ name: 'customer-reviews.update', params: { id: item.id } }"
                        >
                            <pencil-alt-icon />
                        </v-btn>
                        <v-btn v-if="$can('delete customer reviews')" icon @click.prevent="deleteCustomerReview(item)">
                            <trash-icon />
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
import CustomerReview from '../models/CustomerReview';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        PageHeader,
        AdvancedSearchForm,
    },
    mixins: [DatatableMixin],
    data() {
        return {
            customer_reviews: [],
            searchForm: {
                company_name: null,
                is_in_home: null,
                type: null,
            },
            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Автор', align: 'left', value: 'author' },
                { text: 'Отображается на главной', value: 'isInHomeLabel' },
                { text: 'Дата создания', align: 'left', value: 'created_at' },
                { text: '', sortable: false, align: 'right', value: 'action' },
            ],
            breadcrumbs: [{ text: 'Список отзывов' }],
            filters: [
                {
                    label: 'Название',
                    name: 'company_name',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'ID',
                    name: 'id',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'Автор',
                    name: 'author',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'Отображается на главной',
                    name: 'is_in_home',
                    component: () => import('@/components/search/fields/BooleanSelectSearchField'),
                },
            ],
        };
    },
    async fetch() {
        this.showLoading();
        const response = await CustomerReview.params(this.queryParams).get();
        this.customer_reviews = CustomerReview.hydrate(response.data);
        this.setTotal(response.meta.total);
        this.hideLoading();
    },
    head: {
        title: 'Отзывы',
    },
    methods: {
        async deleteCustomerReview(customer_review) {
            if (!(await this.$confirm(`Вы действительно хотите удалить отзыва ${customer_review.company_name}?`))) {
                return;
            }
            try {
                await customer_review.delete();

                this.$snackbar(`Отзыв успешно удален`);
                this.customer_reviews = this.customer_reviews.filter((item) => item.id !== customer_review.id);
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
