<template>
    <div>
        <page-header h1="Журнал событий" :breadcrumbs="breadcrumbs" />

        <advanced-search-form fast-filter-name="live" :filters="filters" :value="searchForm" @search="search" />

        <v-card>
            <v-data-table
                v-model="selectedItems"
                item-key="id"
                :headers="headers"
                :items="activities"
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
                <template #item.created_at="{ item }">
                    <div>{{ item.asDate('created_at').format('DD.MM.YYYY HH:mm') }}</div>
                </template>


                <template #item.properties="{ item }">
                    <div v-if="propertyShow[item.id]" v-text="item.properties"></div>
                    <v-btn v-else @click.prevent="toggleProperty(item.id)">Подробнее</v-btn>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script>
import DatatableMixin from '@/mixins/datatable';
import AdvancedSearchForm from '@/components/search/AdvancedSearchForm';
import PageHeader from '~/components/common/PageHeader';
import Activity from '~/modules/activity/models/Activity'
import { activityEvents } from '~/enums'
import {subjectTypes} from '~/enums'

export default {
    components: {
        PageHeader,
        AdvancedSearchForm,
    },
    mixins: [DatatableMixin],
    data() {
        return {
            activities: [],
            searchForm: {
                id: null,
            },
            propertyShow: {},
            headers: [
                { text: 'Дата и время', align: 'left', value: 'created_at' },
                { text: 'Автор изменений', align: 'left', value: 'causer.name' },
                { text: 'Тип сущности', align: 'left', value: 'subject_type' },
                { text: 'ID сущности', align: 'left', value: 'subject_id' },
                { text: 'Действие', align: 'left', value: 'event' },
                { text: 'Доп. параметры', align: 'left', value: 'properties' },
            ],
            breadcrumbs: [{ text: 'Список событий' }],
            filters: [
                {
                    label: 'Быстрый поиск',
                    name: 'live',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'Действие',
                    name: 'event',
                    component: () => import('@/components/search/fields/SelectSearchField'),
                    items: activityEvents,
                },
                {
                    label: 'Тип сущности',
                    name: 'subject_type',
                    component: () => import('@/components/search/fields/SelectSearchField'),
                    items: subjectTypes,
                },
                {
                    label: 'ID сущности',
                    name: 'subject_id',
                    component: () => import('@/components/search/fields/TextSearchField'),
                    items: subjectTypes,
                },
                {
                    label: 'ID',
                    name: 'id',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
            ],
        };
    },
    async fetch() {
        this.showLoading();

        const response = await Activity.select({
            activities: ['id', 'created_at', 'subject_type', 'subject_id', 'causer_id', 'causer_type'],
        })
            .with('causer')
            .params(this.queryParams)
            .get();



        this.activities = Activity.hydrate(response.data);

        this.activities.forEach((activity) => {
            this.propertyShow[activity.id] = false
        })

        this.setTotal(response.meta.total);
        this.hideLoading();
    },
    head: {
        title: 'События',
    },
    methods: {
        toggleProperty(id) {
            this.propertyShow[id] = true
        }
    }
};
</script>
