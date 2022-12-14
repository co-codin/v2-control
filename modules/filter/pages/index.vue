<template>
    <div>
        <page-header h1="Фильтры" :breadcrumbs="breadcrumbs"></page-header>

        <div v-if="$can('create filters') || $can('sort filters')" class="mb-2">
            <v-btn v-if="$can('create filters')" :to="{ name: 'filters.create' }" class="mr-1"> Добавить фильтр </v-btn>
            <v-btn v-if="$can('sort filters')" :to="{ name: 'filters.sort' }"> Сортировка фильтров </v-btn>
        </div>

        <advanced-search-form fast-filter-name="live" :filters="formFilters" :value="searchForm" @search="search" />

        <v-card>
            <v-data-table
                v-model="selectedItems"
                item-key="id"
                :headers="headers"
                :items="filters"
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

                <template #item.type="{ item }">
                    <div class="text-no-wrap">
                        {{ typeLabels.find((el) => el.value === item.type).text }}
                    </div>
                </template>

                <template #item.created_at="{ item }">
                    <div>{{ item.asDate('created_at').fromNow() }}</div>
                </template>

                <template #item.category="{ item }">
                    <div v-html="item.fullCategoryPath"></div>
                </template>

                <template #item.action="{ item }">
                    <div class="table-actions">
                        <v-btn v-if="$can('edit filters')" icon :to="{ name: 'filters.update', params: { id: item.id } }">
                            <pencil-alt-icon />
                        </v-btn>
                        <v-btn v-if="$can('delete filters')" icon @click.prevent="deleteFilter(item)">
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
import Filter from '../models/Filter';
import PageHeader from '~/components/common/PageHeader';
import { typeLabels } from '~/enums';

export default {
    components: {
        PageHeader,
        AdvancedSearchForm,
    },
    mixins: [DatatableMixin],
    data() {
        return {
            filters: [],
            typeLabels,
            searchForm: {
                name: null,
                category_id: null,
                type: null,
                is_default: null,
            },
            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Название', align: 'left', value: 'name' },
                { text: 'Ссылка', align: 'left', value: 'slug', sortable: false },
                {
                    text: 'Тип',
                    value: 'type',
                },
                { text: 'Категории', align: 'left', value: 'category', sortable: false },
                { text: 'Дата создания', align: 'left', value: 'created_at' },
                { text: '', sortable: false, align: 'right', value: 'action' },
            ],
            breadcrumbs: [{ text: 'Список фильтров' }],
            formFilters: [
                {
                    label: 'Быстрый поиск',
                    name: 'live',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
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
                    label: 'Сайт',
                    name: 'website',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'Отображается на главной',
                    name: 'is_in_home',
                    component: () => import('@/components/search/fields/BooleanSelectSearchField'),
                },
                {
                    label: 'Категория',
                    name: 'category_id',
                    component: () => import('@/components/search/fields/CategoryTreeSearchField'),
                },
            ],
        };
    },
    async fetch() {
        this.showLoading();

        const response = await Filter.select({
            filters: ['id', 'name', 'slug', 'type', 'category_id', 'created_at'],
            category: ['id', 'name', '_lft', '_rgt'],
            'category.ancestors': ['id', '_lft', '_rgt', 'name'],
        })
            .with('category', 'category.ancestors')
            .params(this.queryParams)
            .get();

        this.filters = Filter.hydrate(response.data);
        this.setTotal(response.meta.total);
        this.hideLoading();
    },
    head: {
        title: 'Фильтры',
    },
    methods: {
        async deleteFilter(filter) {
            if (!(await this.$confirm(`Вы действительно хотите удалить фильтра ${filter.name}?`))) {
                return;
            }
            try {
                await filter.delete();

                this.$snackbar(`Фильтр ${filter.name} успешно удален`);
                this.filters = this.filters.filter((item) => item.id !== filter.id);
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
