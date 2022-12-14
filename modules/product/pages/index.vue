<template>
    <div>
        <page-header h1="Товары" :breadcrumbs="breadcrumbs" />

        <div v-if="$can('create products')" class="mb-2">
            <v-btn :to="{ name: 'products.create' }"> Добавить товар </v-btn>
        </div>

        <advanced-search-form fast-filter-name="live" :filters="filters" :value="searchForm" @search="search" />

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
                @update:items-per-page="updateOptions('itemsPerPage', $event)"
                @update:page="updateOptions('page', $event)"
                @update:sort-by="updateOptions('sortBy', $event)"
                @update:sort-desc="updateOptions('sortDesc', $event)"
            >
                <template #item.id="{ item }">
                    <div class="font-weight-bold text-no-wrap"># {{ item.id }}</div>
                </template>

                <template #item.category.name="{ item }">
                    <div>
                        {{
                            item.category.parent_id
                                ? item.category.parent.name + ' / ' + item.category.name
                                : item.category.name
                        }}
                    </div>
                </template>

                <template #item.created_at="{ item }">
                    <div>{{ item.asDate('created_at').fromNow() }}</div>
                </template>

                <template #item.action="{ item }">
                    <div class="table-actions">
                        <v-btn
                            icon
                            target="_blank"
                            link
                            :href="`${$config.app.siteUrl}/product/${item.slug}/${item.id}`"
                        >
                            <external-link-icon />
                        </v-btn>
                        <v-btn
                            v-if="$can('edit products')"
                            width="22"
                            height="22"
                            icon
                            :to="{ name: 'products.update', params: { id: item.id } }"
                        >
                            <pencil-alt-icon />
                        </v-btn>
                        <v-btn
                            v-if="$can('delete products')"
                            icon
                            @click="deleteProduct(item)"
                        >
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
import { statusLabels, uniqueContentList, groupLabels } from '@/enums';
import Product from '../models/Product';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        AdvancedSearchForm,
        PageHeader,
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
                { text: 'Артикул', align: 'left', value: 'article', cellClass: 'text-no-wrap' },
                { text: 'Производитель', align: 'left', value: 'brand.name', sortable: false },
                { text: 'Модель', align: 'left', value: 'name' },
                { text: 'Категория', align: 'left', value: 'category.name', sortable: false },
                { text: 'Ссылка', align: 'left', value: 'slug' },
                { text: 'Дата создания', align: 'left', value: 'created_at' },
                { text: 'Статус', value: 'status.description', sortable: false },
                { text: '', sortable: false, align: 'right', value: 'action' },
            ],
            breadcrumbs: [{ text: 'Список товаров' }],
            filters: [
                {
                    label: 'Быстрый поиск',
                    name: 'live',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'Главная категория',
                    name: 'categories.parent_category_id',
                    component: () => import('@/components/search/fields/CategoryTreeSearchField'),
                },
                {
                    label: 'Категории',
                    name: 'categories.id',
                    component: () => import('@/components/search/fields/CategoryTreeSearchField'),
                },
                {
                    label: 'Группа',
                    name: 'group_id',
                    component: () => import('@/components/search/fields/SelectSearchField'),
                    items: groupLabels
                },
                {
                    label: 'ID',
                    name: 'id',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'Артикул',
                    name: 'article',
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
                    items: statusLabels,
                },
                {
                    label: 'Отображается на главной',
                    name: 'is_in_home',
                    component: () => import('@/components/search/fields/BooleanSelectSearchField'),
                },
                {
                    label: 'Есть брошюра',
                    name: 'has_booklet',
                    component: () => import('@/components/search/fields/BooleanSelectSearchField'),
                },
                {
                    label: 'Есть видео',
                    name: 'has_video',
                    component: () => import('@/components/search/fields/BooleanSelectSearchField'),
                },
                {
                    label: 'Уникальный контент',
                    name: 'unique_content',
                    component: () => import('@/components/search/fields/SelectSearchField'),
                    items: uniqueContentList,
                },
                {
                    label: 'Нет уникального контента',
                    name: 'no_unique_content',
                    component: () => import('@/components/search/fields/SelectSearchField'),
                    items: uniqueContentList,
                },
                {
                    label: 'Производитель',
                    name: 'brand_id',
                    component: () => import('@/components/search/fields/AutocompleteSearchField'),
                    url: '/brands',
                },
            ],
        };
    },
    async fetch() {
        this.showLoading();

        const response = await Product.select({
            products: ['id', 'article', 'name', 'brand_id', 'slug', 'status', 'created_at'],
            brand: ['id', 'name'],
            category: ['id', 'name', 'parent_id'],
            categories: ['id', 'name'],
        })
            .with('brand', 'category.parent', 'categories')
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
                this.$snackbar(`Товар ${product.name} успешно удален`);
                this.$fetch();
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
