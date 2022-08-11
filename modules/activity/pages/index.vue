<template>
    <div>
        <page-header h1="Достижения" :breadcrumbs="breadcrumbs" />

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
                <template #item.id="{ item }">
                    <div class="font-weight-bold"># {{ item.id }}</div>
                </template>

                <template #item.is_enabled="{ item }">
                    <div class="font-weight-bold">{{ item.is_enabled ? 'Да' : 'Нет' }}</div>
                </template>

                <template #item.created_at="{ item }">
                    <div>{{ item.asDate('created_at').format('DD.MM.YYYY HH:mm') }}</div>
                </template>

                <template #item.properties="{ item }">
                    <div v-if="propertyShow[item.id]">{{ item.properties }}</div>
                    <div v-else @click.prevent="propertyShow[item.id] = true">Подробнее</div>
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
            propertyShow: [],
            headers: [
                { text: 'Дата и время', align: 'left', value: 'created_at' },
                { text: 'Автор изменений', align: 'left', value: 'causer.name' },
                { text: 'Тип сущности', align: 'left', value: 'subject_type' },
                { text: 'ID сущности', align: 'left', value: 'id' },
                { text: 'Действие', align: 'left', value: 'event' },
                { text: 'Доп. параметры', align: 'left', value: 'properties' },
            ],
            breadcrumbs: [{ text: 'Список событий' }],
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

        console.log(response.data)

        this.activities = Activity.hydrate(response.data);

        this.setTotal(response.meta.total);
        this.hideLoading();
    },
    head: {
        title: 'События',
    },
};
</script>
