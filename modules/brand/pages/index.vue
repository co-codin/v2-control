<template>
    <div>
        <page-header h1="Производители" :breadcrumbs="breadcrumbs" />

        <div v-if="$can('create brands')" class="mb-2">
            <v-btn :to="{ name: 'brands.create' }"> Добавить производителя </v-btn>
        </div>

        <advanced-search-form fast-filter-name="live" :filters="filters" :value="searchForm" @search="search" />

        <v-card>
            <v-data-table
                v-model="selectedItems"
                item-key="id"
                :headers="headers"
                :items="brands"
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
                            v-if="$can('view products')"
                            :title="`Товары производителя ${item.name}`"
                            icon
                            class="mr-1"
                            :to="{ name: 'products.index', query: { filter: `brand_id[]=${item.id}` } }"
                        >
                            <collection-icon /> <span style="margin-left: 3px">{{ item.products_count }}</span>
                        </v-btn>
                        <v-btn icon target="_blank" link :href="`${$config.app.siteUrl}/brands/${item.slug}`">
                            <external-link-icon />
                        </v-btn>
                        <v-btn
                            v-if="$can('edit brands')"
                            icon
                            :to="{ name: 'brands.update', params: { id: item.id } }"
                        >
                            <pencil-alt-icon />
                        </v-btn>
                        <v-btn
                            v-if="$can('delete brands')"
                            icon
                            @click.prevent="deleteBrand(item)"
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
import { statusLabels } from '@/enums';
import Brand from '../models/Brand';
import PageHeader from '~/components/common/PageHeader';
import CollectionIcon from '~/components/heroicons/CollectionIcon';

export default {
    components: {
        AdvancedSearchForm,
        PageHeader,
        CollectionIcon,
    },
    mixins: [DatatableMixin],
    data() {
        return {
            brands: [],
            searchForm: {
                name: null,
                is_in_home: null,
                status: null,
            },
            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Название', align: 'left', value: 'name' },
                { text: 'Ссылка', align: 'left', value: 'slug' },
                { text: 'Дата создания', align: 'left', value: 'created_at' },
                { text: 'Статус', value: 'status.description', sortable: false },
                { text: 'Страна', value: 'country.value', sortable: false },
                { text: '', sortable: false, align: 'right', value: 'action' },
            ],
            breadcrumbs: [{ text: 'Список производителей' }],
            filters: [
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
                    label: 'Страна',
                    name: 'country_id',
                    component: () => import('@/components/forms/FieldValueAutocomplete'),
                },
            ],
        };
    },
    async fetch() {
        this.showLoading();

        const response = await Brand.select({
            brands: ['id', 'name', 'slug', 'status', 'country_id', 'created_at'],
        })
            .with('country', 'productsCount')
            .params(this.queryParams)
            .get();

        this.brands = Brand.hydrate(response.data);

        this.setTotal(response.meta.total);
        this.hideLoading();
    },
    head: {
        title: 'Производители',
    },
    methods: {
        async deleteBrand(brand) {
            if (!(await this.$confirm(`Вы действительно хотите удалить производителя ${brand.name}?`))) {
                return;
            }
            try {
                await brand.delete();

                this.$snackbar(`Производитель ${brand.name} успешно удален`);
                this.brands = this.brands.filter((item) => item.id !== brand.id);
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
