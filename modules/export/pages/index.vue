<template>
    <div>
        <page-header h1="Экспорт" :breadcrumbs="breadcrumbs" />

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

                <template #item.exported_at="{ item }">
                    <div v-if="item.exported_at">
                        {{ item.asDate('exported_at').format('DD-MM-YYYY') }} в
                        {{ item.asDate('exported_at').format('HH:mm') }}
                    </div>
                </template>

                <template #item.action="{ item }">
                    <div class="table-actions">
                        <v-btn icon target="_blank" link @click.prevent="refreshExport(item)">
                            <SvgIcon name="refresh" />
                        </v-btn>
                        <v-btn icon target="_blank" link :href="`${$config.app.siteUrl}/feeds/${item.filename}`">
                            <eye-icon />
                        </v-btn>
                        <v-btn
                            width="22"
                            height="22"
                            class="mx-1"
                            icon
                            :to="{ name: 'exports.update', params: { id: item.id } }"
                        >
                            <pencil-alt-icon />
                        </v-btn>

                        <v-btn icon @click.prevent="deleteExport(item)">
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
import { exportTypeLabels, frequencyLabels } from '@/enums';
import Export from '~/modules/export/models/Export';
import PageHeader from '~/components/common/PageHeader';
import EyeIcon from '~/components/heroicons/EyeIcon';
import SvgIcon from '~/components/SvgIcon';

export default {
    components: {
        SvgIcon,
        EyeIcon,
        PageHeader,
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
                { text: 'Частота', align: 'left', value: 'frequency.description' },
                { text: 'Название файла', align: 'left', value: 'filename', sortable: false },
                { text: 'Дата последней генерации', align: 'left', value: 'exported_at' },

                { text: '', sortable: false, align: 'right', value: 'action' },
            ],
            breadcrumbs: [{ text: 'Экспорты' }],
            filters: [
                {
                    label: 'Комментарий',
                    name: 'name',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'ID',
                    name: 'id',
                    component: () => import('@/components/search/fields/TextSearchField'),
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
            exports: ['id', 'name', 'type', 'filename', 'frequency', 'exported_at'],
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
        async refreshExport(item) {
            try {
                await this.$axios.post(`/exports/manually/${item.id}`);
                this.$snackbar(`Достижение ${item.name} успешно обновлен`);
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
