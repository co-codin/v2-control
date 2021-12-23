<template>
    <div>
        <page-header h1="Значения характеристик" :breadcrumbs="breadcrumbs" />

        <div class="mb-2">
            <v-btn :to="{ name: 'field-values.create' }"> Добавить значение </v-btn>
        </div>

        <advanced-search-form fast-filter-name="live" :filters="filters" :value="searchForm" @search="search" />

        <v-card>
            <v-data-table
                v-model="selectedItems"
                item-key="id"
                :headers="headers"
                :items="fieldValues"
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

                <template #item.value="{ item }">
                    <div style="max-width: 300px;">
                        {{ item.value }}
                    </div>
                </template>

                <template #item.action="{ item }">
                    <div class="table-actions">
                        <v-btn icon :to="{ name: 'field-values.update', params: { id: item.id } }">
                            <pencil-alt-icon />
                        </v-btn>
                        <v-btn icon @click.prevent="deleteFieldValue(item)">
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
import FieldValue from "~/modules/field-value/models/FieldValue";
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        PageHeader,
        AdvancedSearchForm,
    },
    mixins: [DatatableMixin],
    data() {
        return {
            fieldValues: [],
            searchForm: {
                live: null,
                id: null,
                value: null,
            },
            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Значение', align: 'left', value: 'value' },
                { text: '', sortable: false, align: 'right', value: 'action' },
            ],
            breadcrumbs: [{ text: 'Список значений харакетристик' }],
            filters: [
                {
                    label: 'Быстрый поиск',
                    name: 'live',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'ID',
                    name: 'id',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'Значение',
                    name: 'value',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
            ],
        };
    },
    async fetch() {
        this.showLoading();
        const response = await FieldValue.query()
            .params(this.queryParams)
            .get();
        this.fieldValues = FieldValue.hydrate(response.data);
        this.setTotal(response.meta.total);
        this.hideLoading();
    },
    head: {
        title: 'Значения характеристик',
    },
    methods: {
        async deleteFieldValue(fieldValue) {
            if (!(await this.$confirm(`Вы действительно хотите удалить значение ${fieldValue.value}?`))) {
                return;
            }
            try {
                await fieldValue.delete();
                this.$snackbar(`Значение ${fieldValue.value} успешно удалено`);
                this.fieldValues = this.fieldValues.filter((item) => item.id !== fieldValue.id);
            } catch (e) {
                this.$snackbar(e?.response?.data?.message ?? e.message);
            }
        },
    },
};
</script>
