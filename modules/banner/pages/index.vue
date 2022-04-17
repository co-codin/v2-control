<template>
    <div>
        <page-header h1="Баннеры" :breadcrumbs="breadcrumbs" />

        <div class="mb-2">
            <v-btn :to="{ name: 'banners.create' }" class="mr-1"> Добавить баннер </v-btn>
            <v-btn :to="{ name: 'banners.sort' }"> Сортировка баннеров </v-btn>
        </div>

        <advanced-search-form fast-filter-name="live" :filters="filters" :value="searchForm" @search="search" />

        <v-card>
            <v-data-table
                v-model="selectedItems"
                item-key="id"
                :headers="headers"
                :items="banners"
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
                    <div class="font-weight-bold text-no-wrap"># {{ item.id }}</div>
                </template>

                <template #item.page="{ item }">
                    {{ $enum('BannerPage')[item.page] }}
                </template>

                <template #item.created_at="{ item }">
                    <div>{{ item.asDate('created_at').fromNow() }}</div>
                </template>

                <template #item.action="{ item }">
                    <div class="table-actions">
                        <v-btn icon target="_blank" link :href="`${$config.app.siteUrl}/banners/${item.slug}`">
                            <external-link-icon />
                        </v-btn>
                        <v-btn icon :to="{ name: 'banners.update', params: { id: item.id } }">
                            <pencil-alt-icon />
                        </v-btn>
                        <v-btn icon @click.prevent="deleteBanner(item)">
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
import Banner from '../models/Banner';
import PageHeader from '~/components/common/PageHeader';
import { mapGetters } from "vuex";

export default {
    components: {
        AdvancedSearchForm,
        PageHeader
    },
    mixins: [DatatableMixin],
    data() {
        return {
            banners: [],
            searchForm: {
                live: null,
                name: null,
                is_enabled: null,
                page: null,
                id: null,
                url: null,
            },
            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Название', align: 'left', value: 'name' },
                { text: 'Ссылка', align: 'left', value: 'url' },
                { text: 'Страница', align: 'left', value: 'page' },
                { text: 'Дата создания', align: 'left', value: 'created_at' },
                { text: '', sortable: false, align: 'right', value: 'action' },
            ],
            breadcrumbs: [{ text: 'Список баннеров' }],
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
                    label: 'ID',
                    name: 'id',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'Ссылка',
                    name: 'url',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'Страница',
                    name: 'page',
                    component: () => import('@/components/search/fields/SelectSearchField'),
                    items: this.$enum('BannerPage', true),
                },
                {
                    label: 'Отображается на сате',
                    name: 'is_enabled',
                    component: () => import('@/components/search/fields/BooleanSelectSearchField'),
                }
            ],
        };
    },
    async fetch() {
        this.showLoading();

        const response = await Banner.params(this.queryParams).get();

        this.banners = Banner.hydrate(response.data);

        this.setTotal(response.meta.total);
        this.hideLoading();
    },
    head: {
        title: 'Баннеры',
    },
    methods: {
        async deleteBanner(banner) {
            if (!(await this.$confirm(`Вы действительно хотите удалить баннер ${banner.name}?`))) {
                return;
            }
            try {
                await banner.delete();

                this.$snackbar(`Баннер ${banner.name} успешно удален`);
                this.banners = this.banners.filter((item) => item.id !== banner.id);
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
