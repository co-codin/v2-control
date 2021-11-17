<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex align-center py-3 pb-0">
            <div>
                <div class="display-1">Экспорт</div>
                <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
            </div>
        </div>

        <div class="mb-2">
            <v-btn :to="{ name: 'exports.create' }"> Добавить экспорт </v-btn>
        </div>

        <advanced-search-form :filters="filters" :value="searchForm" @search="search" />

        <v-card>
            <v-data-table
                v-model="selectedItems"
                item-key="id"
                :headers="headers"
                :items="exports"
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

                <template #item.is_enabled="{ item }">
                    <div class="font-weight-bold">{{ item.is_enabled ? 'Да' : 'Нет' }}</div>
                </template>

                <template #item.created_at="{ item }">
                    <div>{{ item.asDate('created_at').fromNow() }}</div>
                </template>

                <template #item.action="{ item }">
                    <div class="actions">
                        <v-btn icon width="22" height="22" :to="{ name: 'exports.update', params: { id: item.id } }">
                            <pencil-alt-icon class="h-6 w-6" />
                        </v-btn>

                        <v-btn icon width="22" height="22" class="mx-1" @click.prevent="deleteExport(item)">
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
import { exportTypeLabels, frequencyLabels } from '@/enums';
import Export from '~/modules/export/models/Export';

export default {
    components: {
        AdvancedSearchForm,
    },
    mixins: [DatatableMixin],
    data() {
        return {
            exports: [],
            searchForm: {
                name: null,
                filename: null,
            },
            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Комментарий', align: 'left', value: 'name' },
                { text: 'Тип', align: 'left', value: 'type.description' },
                { text: 'Частота', align: 'left', value: 'type.description' },
                { text: 'Название файла', align: 'left', value: 'filename', sortable: false },

                { text: '', sortable: false, align: 'right', value: 'action' },
            ],
            breadcrumbs: [{ text: 'Главная', href: '/' }, { text: 'Список достижений' }],
            filters: [
                {
                    label: 'Комментарий',
                    name: 'name',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'ID',
                    name: 'id',
                    component: () => import('@/components/search/fields/ComboBoxSearchField'),
                },
                {
                    label: 'Тип',
                    name: 'type',
                    component: () => import('@/components/search/fields/SelectSearchField'),
                    items: exportTypeLabels,
                },
                {
                    label: 'Частота',
                    name: 'frequency',
                    component: () => import('@/components/search/fields/SelectSearchField'),
                    items: frequencyLabels,
                },
            ],
        };
    },
    async fetch() {
        this.showLoading();

        const response = await Export.select({
            exports: ['id', 'name', 'type', 'filename', 'frequency'],
        })
            .params(this.queryParams)
            .get();

        this.exports = Export.hydrate(response.data);

        this.setTotal(response.meta.total);
        this.hideLoading();
    },
    head: {
        title: 'Экспорт',
    },
    methods: {
        async deleteExport(item) {
            if (!(await this.$confirm(`Вы действительно хотите удалить достижения ${item.name}?`))) {
                return;
            }

            try {
                await item.delete();

                this.$snackbar(`Достижение ${item.name} успешно удален`);
                this.exports = this.exports.filter((el) => el.id !== item.id);
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
