<template>
    <div>
        <page-header h1="Города" :breadcrumbs="breadcrumbs" />

        <div class="mb-2">
            <v-btn :to="{ name: 'cities.create' }"> Добавить город </v-btn>
        </div>

        <advanced-search-form :filters="filters" :value="searchForm" @search="search" />

        <v-card>
            <v-data-table
                v-model="selectedItems"
                item-key="id"
                :headers="headers"
                :items="cities"
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
                    <div class="font-weight-bold"># {{ item.id }}</div>
                </template>

                <template #item.created_at="{ item }">
                    <div>{{ item.asDate('created_at').fromNow() }}</div>
                </template>

                <template #item.coordinate="{ item }">
                    <span v-if="item.coordinate"> {{ item.coordinate.lat }} : {{ item.coordinate.long }} </span>
                </template>

                <template #item.is_default="{ item }">
                    <span> {{ item.is_default ? 'Да' : 'Нет' }} </span>
                </template>

                <template #item.action="{ item }">
                    <div class="table-actions">
                        <v-btn icon :to="{ name: 'cities.update', params: { id: item.id } }">
                            <pencil-alt-icon />
                        </v-btn>

                        <v-btn icon @click="deleteCity(item)">
                            <trash-icon />
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
import { statusLabels } from '@/enums';
import City from '../models/City';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        PageHeader,
        AdvancedSearchForm,
    },
    mixins: [DatatableMixin],
    data() {
        return {
            cities: [],
            searchForm: {
                name: null,
                status: null,
            },
            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Название', align: 'left', value: 'name' },
                { text: 'Ссылка', align: 'left', value: 'slug' },
                { text: 'Координаты центра', align: 'left', value: 'coordinate', sortable: false },
                { text: 'Статус', value: 'status.description', sortable: false },
                { text: 'Федеральный округ', align: 'left', value: 'federal_district' },
                { text: 'Региональный телефон', value: 'region_phone', sortable: false },
                { text: 'email', value: 'email', sortable: false },
                { text: 'По умолчанию', value: 'is_default', sortable: false },
                { text: 'Дата создания', align: 'left', value: 'created_at' },
                { text: '', sortable: false, align: 'right', value: 'action' },
            ],
            breadcrumbs: [{ text: 'Список городов' }],
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
                {
                    label: 'По умолчанию',
                    name: 'is_default',
                    component: () => import('@/components/search/fields/BooleanSelectSearchField'),
                },
            ],
        };
    },
    async fetch() {
        this.showLoading();

        const response = await City.select({
            cities: [
                'id',
                'name',
                'slug',
                'status',
                'coordinate',
                'federal_district',
                'region_phone',
                'email',
                'created_at',
                'is_default',
            ],
        })
            .params(this.queryParams)
            .get();

        this.cities = City.hydrate(response.data);

        this.setTotal(response.meta.total);
        this.hideLoading();
    },
    head: {
        title: 'Города',
    },
    methods: {
        async deleteCity(city) {
            if (!(await this.$confirm(`Вы действительно хотите удалить город ${city.name}?`))) {
                return;
            }
            try {
                await city.delete();

                this.$snackbar(`Город ${city.name} успешно удален`);

                this.cities = this.cities.filter((item) => item.id !== city.id);
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
