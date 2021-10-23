<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex align-center py-3 pb-0">
            <div>
                <div class="display-1">Товары</div>
                <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
            </div>
        </div>

        <div class="mb-2">
            <v-btn :to="{ name: 'products.create' }"> Добавить товар </v-btn>
        </div>

        <advanced-search-form :filters="filters" :value="searchForm" @search="search" />

        <v-card>
            <v-data-table
                v-model="selectedItems"
                item-key="id"
                :headers="headers"
                :items="products"
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
                    <div class="font-weight-bold"># {{ item.id }}</div>
                </template>

                <template #item.created_at="{ item }">
                    <div>{{ item.asDate('created_at').fromNow() }}</div>
                </template>

                <template #item.action="{ item }">
                    <div class="actions">
                        <v-btn icon width="22" height="22" :to="{ name: 'products.update', params: { id: item.id } }">
                            <pencil-alt-icon class="h-6 w-6" />
                        </v-btn>

                        <v-btn icon width="22" height="22" class="mx-1" @click="deleteBrand(item)">
                            <trash-icon class="h-6 w-6" />
                        </v-btn>

                        <v-btn icon width="22" height="22">
                            <dots-horizontal-icon class="h-6 w-6" />
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
import { enumToSelectArray, StatusDescription } from '@/enums';
import Product from '../models/Product';

export default {
    components: {
        AdvancedSearchForm,
    },
    mixins: [DatatableMixin],
    data() {
        return {
            products: [],
            searchForm: {
                name: null,
                is_in_home: null,
                status: null,
            },
            headers: [
                { text: 'ID', align: 'left', value: 'id', cellClass: 'text-no-wrap' },
                { text: 'Производитель', align: 'left', value: 'brand.name' },
                { text: 'Модель', align: 'left', value: 'name' },
                { text: 'Категория', align: 'left', value: 'category.name' },
                { text: 'Ссылка', align: 'left', value: 'slug' },
                { text: 'Дата создания', align: 'left', value: 'created_at' },
                { text: 'Статус', value: 'status.description', sortable: false },
                { text: '', sortable: false, align: 'right', value: 'action' },
            ],
            breadcrumbs: [{ text: 'Главная', href: '/' }, { text: 'Товары' }],
            filters: [
                {
                    label: 'Название',
                    name: 'name',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'ID',
                    name: 'id',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'Ссылка',
                    name: 'slug',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'Статус',
                    name: 'status',
                    component: () => import('@/components/search/fields/SelectSearchField'),
                    items: enumToSelectArray(StatusDescription),
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

        const response = await Product.select({
            products: ['id', 'name', 'brand_id', 'slug', 'status', 'created_at'],
            brand: ['id', 'name'],
            category: ['id', 'name'],
            categories: ['id', 'name'],
        })
            .with('brand', 'category', 'categories')
            .params(this.queryParams)
            .get();

        this.products = Product.hydrate(response.data);

        this.setTotal(response.meta.total);
        this.hideLoading();
    },
    head: {
        title: 'Товары',
    },
    methods: {
        async deleteProduct(product) {
            if (!(await this.$confirm(`Вы действительно хотите удалить ${product.name}?`))) {
                return;
            }
            try {
                await product.delete();
                this.$snackbar(`Производитель ${product.name} успешно удален`);
                this.$fetch();
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
