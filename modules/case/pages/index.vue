<template>
    <div>
        <page-header h1="Реализованные проекты" :breadcrumbs="breadcrumbs" />

        <div class="mb-2">
            <v-btn :to="{ name: 'cases.create' }"> Добавить проект </v-btn>
        </div>

        <advanced-search-form fast-filter-name="live" :filters="filters" :value="searchForm" @search="search" />

        <v-card>
            <v-data-table
                v-model="selectedItems"
                item-key="id"
                :headers="headers"
                :items="cases"
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
                    <div class="table-actions">
                        <v-btn icon target="_blank" link :href="`${$config.app.siteUrl}/cases/${item.slug}`">
                            <external-link-icon />
                        </v-btn>
                        <v-btn icon :to="{ name: 'cases.update', params: { id: item.id } }">
                            <pencil-alt-icon />
                        </v-btn>
                        <v-btn icon @click.prevent="deleteCase(item)">
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
import Case from '../models/Case';
import PageHeader from '~/components/common/PageHeader';
import { statusLabels } from '~/enums'

export default {
    components: {
        AdvancedSearchForm,
        PageHeader,
    },
    mixins: [DatatableMixin],
    data() {
        return {
            cases: [],
            searchForm: {
                name: null,
                status: null,
                slug: null,
            },
            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Название', align: 'left', value: 'name' },
                { text: 'Что сделано?', align: 'left', value: 'summary' },
                { text: 'Город', value: 'city.name', sortable: false },
                { text: 'Ссылка', align: 'left', value: 'slug' },
                { text: 'Дата поставки', align: 'left', value: 'published_at' },
                { text: 'Статус', value: 'status.description', sortable: false },
                { text: 'Дата создания', align: 'left', value: 'created_at' },
                { text: 'Год реализации', align: 'left', value: 'released_year' },
                { text: 'Квартал реализации', align: 'left', value: 'released_quarter' },
                { text: '', sortable: false, align: 'right', value: 'action' },
            ],
            breadcrumbs: [{ text: 'Список реализованных проектов' }],
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
                    label: 'Статус',
                    name: 'status',
                    component: () => import('@/components/search/fields/SelectSearchField'),
                    items: statusLabels,
                },
                {
                    label: 'Город',
                    name: 'city_id',
                    component: () => import('@/components/forms/FieldValueAutocomplete'),
                },
            ],
        };
    },
    async fetch() {
        this.showLoading();

        const response = await Case.select({
            case_models: ['id', 'name', 'slug', 'status', 'city_id', 'created_at', 'published_at', 'released_year', 'released_quarter'],
        })
            .with('city')
            .get();

        this.cases = Case.hydrate(response.data);

        this.setTotal(response.meta.total);
        this.hideLoading();
    },
    head: {
        title: 'Реализованные проекты',
    },
    methods: {
        async deleteCase(caseItem) {
            if (!(await this.$confirm(`Вы действительно хотите удалить проект ${caseItem.name}?`))) {
                return;
            }
            try {
                await caseItem.delete();

                this.$snackbar(`Проект ${caseItem.name} успешно удален`);
                this.cases = this.cases.filter((item) => item.id !== caseItem.id);
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
