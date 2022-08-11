<template>
    <div>
        <page-header h1="SEO правила" :breadcrumbs="breadcrumbs" />

        <div v-if="$can('create seo rules')" class="mb-2">
            <v-btn :to="{ name: 'seo-rules.create' }"> Добавить SEO правило </v-btn>
        </div>

        <advanced-search-form fast-filter-name="live" :filters="filters" :value="searchForm" @search="search" />

        <v-card>
            <v-data-table
                v-model="selectedItems"
                item-key="id"
                :headers="headers"
                :items="seoRules"
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

                <template #item.action="{ item }">
                    <div class="table-actions">
                        <v-btn icon target="_blank" link :href="$config.app.siteUrl + item.url">
                            <external-link-icon />
                        </v-btn>
                        <v-btn
                            v-if="$can('edit seo rules')"
                            icon
                            width="22"
                            height="22"
                            class="mx-1"
                            :to="{ name: 'seo-rules.update', params: { id: item.id } }"
                        >
                            <pencil-alt-icon />
                        </v-btn>
                        <v-btn v-if="$can('delete seo rules')" icon @click.prevent="deleteSeoRule(item)">
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
import SeoRule from '../models/SeoRule';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        AdvancedSearchForm,
        PageHeader,
    },
    mixins: [DatatableMixin],
    data() {
        return {
            seoRules: [],
            searchForm: {
                live: null,
                name: null,
                url: null,
            },
            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Название', align: 'left', value: 'name' },
                { text: 'Ссылка', align: 'left', value: 'url' },
                { text: '', sortable: false, align: 'right', value: 'action' },
            ],
            breadcrumbs: [{ text: 'Список SEO правил' }],
            filters: [
                {
                    label: 'Быстрый поиск',
                    name: 'live',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'Название',
                    name: 'name',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'URL',
                    name: 'url',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
            ],
        };
    },
    async fetch() {
        this.showLoading();

        const response = await SeoRule.select({
            seo_rules: ['id', 'name', 'url', 'text'],
        })
            .params(this.queryParams)
            .get();

        this.seoRules = SeoRule.hydrate(response.data);

        this.setTotal(response.meta.total);
        this.hideLoading();
    },
    head: {
        title: 'SEO правила',
    },
    methods: {
        async deleteSeoRule(seoRule) {
            if (!(await this.$confirm(`Вы действительно хотите удалить ${seoRule.name}?`))) {
                return;
            }
            try {
                await seoRule.delete();
                this.$snackbar(`SEO правило ${seoRule.name} успешно удалено`);
                this.seoRules = this.seoRules.filter((item) => item.id !== seoRule.id);
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
