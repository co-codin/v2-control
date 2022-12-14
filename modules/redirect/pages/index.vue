<template>
    <div>
        <page-header h1="Редиректы" :breadcrumbs="breadcrumbs" />

        <div v-if="$can('create redirects')" class="mb-2">
            <v-btn :to="{ name: 'redirects.create' }"> Добавить редирект </v-btn>
        </div>

        <advanced-search-form fast-filter-name="live" :filters="filters" :value="searchForm" @search="search" />

        <v-card>
            <v-data-table
                v-model="selectedItems"
                item-key="id"
                :headers="headers"
                :items="redirects"
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
                    <div class="font-weight-bold text-no-wrap"># {{ item.id }}</div>
                </template>

                <template #item.source="{ item }">
                    <div style="max-width: 300px;">
                        {{ item.source }}
                    </div>
                </template>

                <template #item.destination="{ item }">
                    <div style="max-width: 300px;">
                        {{ item.destination }}
                    </div>
                </template>

                <template #item.action="{ item }">
                    <div class="table-actions">
                        <v-btn
                            v-if="$can('edit redirects')"
                            icon
                            width="22"
                            height="22"
                            class="mx-1"
                            :to="{ name: 'redirects.update', params: { id: item.id } }"
                        >
                            <pencil-alt-icon />
                        </v-btn>
                        <v-btn v-if="$can('delete redirects')" icon @click.prevent="deleteRedirect(item)">
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
import Redirect from '../models/Redirect';
import PageHeader from '~/components/common/PageHeader';
import CopyLabel from '~/components/common/CopyLabel';

export default {
    components: {
        AdvancedSearchForm,
        PageHeader,
        CopyLabel,
    },
    mixins: [DatatableMixin],
    data() {
        return {
            redirects: [],
            searchForm: {
                live: null,
                source: null,
                destination: null,
            },
            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Откуда', align: 'left', value: 'source' },
                { text: 'Куда', align: 'left', value: 'destination' },
                { text: '', sortable: false, align: 'right', value: 'action' },
            ],
            breadcrumbs: [{ text: 'Список редиректов' }],
            filters: [
                {
                    label: 'Быстрый поиск',
                    name: 'live',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'Откуда',
                    name: 'source',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'Куда',
                    name: 'destination',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
            ],
        };
    },
    async fetch() {
        this.showLoading();
        const response = await Redirect.params(this.queryParams).get();
        this.redirects = Redirect.hydrate(response.data);
        this.setTotal(response.meta.total);
        this.hideLoading();
    },
    head: {
        title: 'Редиректы',
    },
    methods: {
        async deleteRedirect(redirect) {
            if (!(await this.$confirm(`Вы действительно хотите удалить ${redirect.name}?`))) {
                return;
            }
            try {
                await redirect.delete();
                this.$snackbar(`Редактор ${redirect.name} успешно удален`);
                this.redirects = this.redirects.filter((item) => item.id !== redirect.id);
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
