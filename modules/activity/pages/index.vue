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

                <template #item.causer.name="{ item }">
                    <div v-if="!item.causer_id">Система</div>
                    <div v-else-if="item.causer_id && !item.causer">Пользователь удален</div>
                    <div v-else>{{item.causer.name}}</div>
                </template>

                <template #item.properties="{ item }">
                    <v-btn small @click.prevent="toggleProperty(item.properties)">Подробнее</v-btn>
                </template>
            </v-data-table>
            <v-dialog
                v-model="popup.show"
            >
                <v-card>
                    <v-card-text>
                        <pre><code v-html="highlight(JSON.stringify(popup.message, null, 2))"></code></pre>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="primary"
                            text
                            @click="popup.show = false"
                        >
                            Закрыть
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card>
    </div>
</template>

<script>
import DatatableMixin from '@/mixins/datatable';
import AdvancedSearchForm from '@/components/search/AdvancedSearchForm';
import PageHeader from '~/components/common/PageHeader';
import Activity from '~/modules/activity/models/Activity'
import { activityEvents } from '~/enums'
import formatHighlight from 'json-format-highlight'

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
            popup: {
                show: false,
                message: ''
            },
            headers: [
                { text: 'Дата и время', align: 'left', value: 'created_at' },
                { text: 'Автор изменений', align: 'left', value: 'causer.name', sortable: false, },
                { text: 'Тип сущности', align: 'left', value: 'subject_type' },
                { text: 'ID сущности', align: 'left', value: 'subject_id' },
                { text: 'Действие', align: 'left', value: 'event', sortable: false, },
                { text: 'Доп. параметры', align: 'left', value: 'properties', sortable: false, },
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
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'Автор изменений',
                    name: 'causer_id',
                    component: () => import('@/components/search/fields/AutocompleteSearchField'),
                    url: '/admin/users',
                },
                {
                    label: 'ID сущности',
                    name: 'subject_id',
                    component: () => import('@/components/search/fields/TextSearchField'),
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

        this.setTotal(response.meta.total);
        this.hideLoading();
    },
    head: {
        title: 'События',
    },
    methods: {
        async toggleProperty(properties) {
            this.$fetch()
            this.popup.show = true
            this.popup.message = properties
        },
        highlight(json) {
            return formatHighlight(json, {
                keyColor: 'black',
                numberColor: 'blue',
                stringColor: '#0B7500',
                trueColor: '#00cc00',
                falseColor: '#ff8080',
                nullColor: 'cornflowerblue'
            })
        }
    }
};
</script>
