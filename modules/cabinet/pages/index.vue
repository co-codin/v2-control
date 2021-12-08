<template>
    <div>
        <page-header h1="Кабинеты" :breadcrumbs="breadcrumbs" />

        <div class="mb-2">
            <v-btn :to="{ name: 'cabinets.create' }"> Добавить кабинет </v-btn>
        </div>

        <advanced-search-form :filters="filters" :value="searchForm" @search="search" />

        <v-card>
            <v-data-table
                v-model="selectedItems"
                item-key="id"
                :headers="headers"
                :items="cabinets"
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

                <template #item.action="{ item }">
                    <div class="actions text-no-wrap">
                        <v-btn icon width="22" height="22" :to="{ name: 'cabinets.update', params: { id: item.id } }">
                            <pencil-alt-icon class="h-6 w-6" />
                        </v-btn>

                        <v-btn icon width="22" height="22" class="mx-1" @click.prevent="deleteCabinet(item)">
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
import PageHeader from '~/components/common/PageHeader';
import Cabinet from '~/modules/cabinet/models/Cabinet';
import { statusLabels } from '~/enums';

export default {
    components: {
        PageHeader,
        AdvancedSearchForm,
    },
    mixins: [DatatableMixin],
    data() {
        return {
            cabinets: [],
            searchForm: {
                name: null,
            },
            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Название', align: 'left', value: 'name' },
                { text: 'Ссылка', align: 'left', value: 'slug' },
                { text: 'Статус', value: 'status.description', sortable: false },
                { text: '', sortable: false, align: 'right', value: 'action' },
            ],
            breadcrumbs: [{ text: 'Главная', href: '/' }, { text: 'Список кабинетов' }],
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
                    items: statusLabels,
                },
            ],
        };
    },
    async fetch() {
        this.showLoading();

        const response = await Cabinet.select({
            cabinets: ['id', 'name', 'slug', 'status'],
        })
            .params(this.queryParams)
            .get();

        this.cabinets = Cabinet.hydrate(response.data);

        this.setTotal(response.meta.total);
        this.hideLoading();
    },
    head: {
        title: 'Кабинеты',
    },
    methods: {
        async deleteCabinet(cabinet) {
            if (!(await this.$confirm(`Вы действительно хотите удалить кабинет ${cabinet.name}?`))) {
                return;
            }
            try {
                await cabinet.delete();

                this.$snackbar(`Кабинет ${cabinet.name} успешно удален`);
                this.cabinets = this.cabinets.filter((item) => item.id !== cabinet.id);
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
