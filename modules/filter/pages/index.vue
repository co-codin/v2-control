<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex align-center py-3 pb-0">
            <div>
                <div class="display-1">Города</div>
                <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
            </div>
        </div>

        <div class="mb-2">
            <v-btn :to="{ name: 'filters.create' }"> Добавить фильтр </v-btn>
        </div>

        <advanced-search-form :filters="filters" :value="searchForm" @search="search" />

        <!--        <v-card>-->
        <!--            <v-data-table-->
        <!--                v-model="selectedItems"-->
        <!--                item-key="id"-->
        <!--                :headers="headers"-->
        <!--                :items="cities"-->
        <!--                :loading="isLoading"-->
        <!--                :server-items-length="total"-->
        <!--                loading-text="Идет загрузка..."-->
        <!--                :options.sync="tableOptions"-->
        <!--                :footer-props="tableFooterProps"-->
        <!--                show-select-->
        <!--                @update:items-per-page="updateOptions('itemsPerPage', $event)"-->
        <!--                @update:page="updateOptions('page', $event)"-->
        <!--                @update:sort-by="updateOptions('sortBy', $event)"-->
        <!--                @update:sort-desc="updateOptions('sortDesc', $event)"-->
        <!--            >-->
        <!--                <template #item.id="{ item }">-->
        <!--                    <div class="font-weight-bold"># {{ item.id }}</div>-->
        <!--                </template>-->

        <!--                <template #item.created_at="{ item }">-->
        <!--                    <div>{{ item.asDate('created_at').fromNow() }}</div>-->
        <!--                </template>-->

        <!--                <template #item.coordinate="{ item }">-->
        <!--                    <span v-if="item.coordinate"> {{ item.coordinate.lat }} : {{ item.coordinate.long }} </span>-->
        <!--                </template>-->

        <!--                <template #item.is_default="{ item }">-->
        <!--                    <span> {{ item.is_default ? 'Да' : 'Нет' }} </span>-->
        <!--                </template>-->

        <!--                <template #item.action="{ item }">-->
        <!--                    <div class="actions">-->
        <!--                        <v-btn icon width="22" height="22" :to="{ name: 'cities.update', params: { id: item.id } }">-->
        <!--                            <pencil-alt-icon class="h-6 w-6" />-->
        <!--                        </v-btn>-->

        <!--                        <v-btn icon width="22" height="22" class="mx-1" @click="deleteCity(item)">-->
        <!--                            <trash-icon class="h-6 w-6" />-->
        <!--                        </v-btn>-->

        <!--                        <v-btn icon width="22" height="22">-->
        <!--                            <dots-horizontal-icon class="h-6 w-6" />-->
        <!--                        </v-btn>-->
        <!--                    </div>-->
        <!--                </template>-->
        <!--            </v-data-table>-->
        <!--        </v-card>-->
    </div>
</template>

<script>
import DatatableMixin from '@/mixins/datatable';
import AdvancedSearchForm from '@/components/search/AdvancedSearchForm';
import { enumToSelectArray, StatusDescription } from '@/enums';
import City from '../models/City';

export default {
    components: {
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
            breadcrumbs: [{ text: 'Главная', href: '/' }, { text: 'Список категорий' }],
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
