<template>
    <div>
        <page-header h1="Валюты" :breadcrumbs="breadcrumbs" />

        <div v-if="$can('create currencies')" class="mb-2">
            <v-btn :to="{ name: 'currencies.create' }"> Добавить валюту </v-btn>
        </div>

        <advanced-search-form :filters="filters" :value="searchForm" @search="search" />

        <v-card>
            <v-data-table
                v-model="selectedItems"
                item-key="id"
                :headers="headers"
                :items="currencies"
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

                <template #item.is_main="{ item }">
                    <div class="font-weight-bold">{{ item.is_main ? 'Да' : 'Нет' }}</div>
                </template>

                <template #item.action="{ item }">
                    <div class="table-actions">
                        <v-btn v-if="$can('edit currencies')" icon :to="{ name: 'currencies.update', params: { id: item.id } }">
                            <pencil-alt-icon />
                        </v-btn>

                        <v-btn v-if="$can('delete currencies')" icon @click.prevent="deleteCurrency(item)">
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
import Currency from '~/modules/currency/models/Currency';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        PageHeader,
        AdvancedSearchForm,
    },
    mixins: [DatatableMixin],
    data() {
        return {
            currencies: [],
            searchForm: {
                name: null,
                is_main: null,
            },
            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Название', align: 'left', value: 'name' },
                { text: 'Сокращение', align: 'left', value: 'iso_code' },
                { text: 'Курс', value: 'rate' },
                { text: 'Главная валюта', align: 'left', value: 'is_main' },
                { text: '', sortable: false, align: 'right', value: 'action' },
            ],
            breadcrumbs: [{ text: 'Список валют' }],
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
                    label: 'Сокращение',
                    name: 'iso_code',
                    component: () => import('@/components/search/fields/ComboBoxSearchField'),
                },
            ],
        };
    },
    async fetch() {
        this.showLoading();

        const response = await Currency.select({
            currencies: ['id', 'name', 'iso_code', 'is_main', 'rate'],
        })
            .params(this.queryParams)
            .get();

        this.currencies = Currency.hydrate(response.data);

        this.setTotal(response.meta.total);
        this.hideLoading();
    },
    head: {
        title: 'Валюты',
    },
    methods: {
        async deleteCurrency(currency) {
            if (!(await this.$confirm(`Вы действительно хотите удалить валюту ${currency.name}?`))) {
                return;
            }
            try {
                await currency.delete();

                this.$snackbar(`Валюта ${currency.name} успешно удалена`);
                this.currencies = this.currencies.filter((item) => item.id !== currency.id);
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
