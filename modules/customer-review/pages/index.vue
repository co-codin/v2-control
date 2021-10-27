<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex align-center py-3 pb-0">
            <div>
                <div class="display-1">Отзывы</div>
                <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
            </div>
        </div>

        <div class="mb-2">
            <v-btn :to="{ name: 'customer_reviews.create' }"> Добавить отзыва </v-btn>
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
                show-select
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
                    <div class="actions text-no-wrap">
                        <v-btn
                            icon
                            width="22"
                            height="22"
                            class="mx-1"
                            :to="{ name: 'customer-reviews.update', params: { id: item.id } }"
                        >
                            <pencil-alt-icon class="h-6 w-6" />
                        </v-btn>
                        <v-btn icon width="22" height="22" @click.prevent="deleteCustomerReview(item)">
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
import CustomerReview from '../models/CustomerReview';

export default {
    components: {
        AdvancedSearchForm,
    },
    mixins: [DatatableMixin],
    data() {
        return {
            customer_reviews: [],
            searchForm: {
                name: null,
                is_in_home: null,
                type: null,
            },
            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Название', align: 'left', value: 'name' },
                { text: 'Автор', align: 'left', value: 'author' },
                { text: 'Отображается на главной', value: 'is_in_home.description' },
                { text: 'Дата создания', align: 'left', value: 'created_at' },
                { text: '', sortable: false, align: 'right', value: 'action' },
            ],
            breadcrumbs: [{ text: 'Главная', href: '/' }, { text: 'Список производителей' }],
            filters: [
                {
                    label: 'Название',
                    name: 'name',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'ID',
                    name: 'id',
                    component: () => import('@/components/search/fields/ComboBoxSearchField'),
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

        const response = await CustomerReview.select({
            customer_reviews: ['id', 'name', 'author', 'is_in_home', 'created_at'],
        })
            .params(this.queryParams)
            .get();

        this.customer_reviews = CustomerReview.hydrate(response.data);

        this.setTotal(response.meta.total);
        this.hideLoading();
    },
    head: {
        title: 'Отзывы',
    },
    methods: {
        async deleteCustomerReview(customer_review) {
            if (!(await this.$confirm(`Вы действительно хотите удалить отзыва ${customer_review.name}?`))) {
                return;
            }
            try {
                await customer_review.delete();

                this.$snackbar(`Отзыв ${customer_review.name} успешно удален`);
                this.customer_reviews = this.customer_reviews.filter((item) => item.id !== customer_review.id);
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
