<template>
    <div>
        <page-header h1="Канонические ссылки" :breadcrumbs="breadcrumbs" />

        <div class="mb-2">
            <v-btn :to="{ name: 'canonicals.create' }"> Добавить каноническую ссылку </v-btn>
        </div>

        <advanced-search-form fast-filter-name="live" :filters="filters" :value="searchForm" @search="search" />

        <v-card>
            <v-data-table
                v-model="selectedItems"
                item-key="id"
                :headers="headers"
                :items="canonicals"
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

                <template #item.created_at="{ item }">
                    <div>{{ item.created_at ? item.asDate('created_at').fromNow() : '' }}</div>
                </template>

                <template #item.action="{ item }">
                    <div class="table-actions">
                        <v-btn icon :to="{ name: 'canonicals.update', params: { id: item.id } }">
                            <pencil-alt-icon />
                        </v-btn>

                        <v-btn icon @click.prevent="deleteCanonical(item)">
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
import Canonical from '~/modules/canonical/models/Canonical';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        PageHeader,
        AdvancedSearchForm,
    },
    mixins: [DatatableMixin],
    data() {
        return {
            canonicals: [],
            searchForm: {
                id: null,
                url: null,
            },
            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Страница', align: 'left', value: 'url' },
                { text: 'Каноническая ссылка', align: 'left', value: 'canonical' },
                { text: 'Дата создания', align: 'left', value: 'created_at' },
                { text: '', sortable: false, align: 'right', value: 'action' },
            ],
            breadcrumbs: [{ text: 'Список канонических ссылок' }],
            filters: [
                {
                    label: 'Быстрый поиск',
                    name: 'live',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'Страница',
                    name: 'url',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'Каноническая ссылка',
                    name: 'canonical',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
            ],
        };
    },
    async fetch() {
        this.showLoading();

        const response = await Canonical.select({
            canonicals: ['id', 'url', 'canonical', 'created_at'],
        })
            .params(this.queryParams)
            .get();

        this.canonicals = Canonical.hydrate(response.data);

        this.setTotal(response.meta.total);
        this.hideLoading();
    },
    head: {
        title: 'Канонические ссылки',
    },
    methods: {
        async deleteCanonical(canonical) {
            if (!(await this.$confirm(`Вы действительно хотите удалить каноническую ссылку ${canonical.url}?`))) {
                return;
            }
            try {
                await canonical.delete();

                this.$snackbar(`Каноническая ссылка ${canonical.url} успешно удалена`);
                this.canonicals = this.canonicals.filter((item) => item.id !== canonical.id);
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
