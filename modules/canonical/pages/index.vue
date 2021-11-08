<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex align-center py-3 pb-0">
            <div>
                <div class="display-1">Канонические ссылки</div>
                <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
            </div>
        </div>

        <div class="mb-2">
            <v-btn :to="{ name: 'canonicals.create' }"> Добавить каноническую ссылку </v-btn>
        </div>

        <advanced-search-form :filters="filters" :value="searchForm" @search="search" />

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
                    <div class="actions text-no-wrap">
                        <v-btn icon width="22" height="22" :to="{ name: 'canonicals.update', params: { id: item.id } }">
                            <pencil-alt-icon class="h-6 w-6" />
                        </v-btn>

                        <v-btn icon width="22" height="22" class="mx-1" @click.prevent="deleteCanonical(item)">
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
import Canonical from '~/modules/canonical/models/Canonical';

export default {
    components: {
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
            breadcrumbs: [{ text: 'Главная', href: '/' }, { text: 'Список канонических ссылок' }],
            filters: [
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
