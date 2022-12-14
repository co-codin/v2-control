<template>
    <div>
        <page-header h1="Публикации" :breadcrumbs="breadcrumbs" />

        <div class="mb-2">
            <v-btn :to="{ name: 'publications.create' }"> Добавить публикацию </v-btn>
        </div>

        <advanced-search-form fast-filter-name="live" :filters="filters" :value="searchForm" @search="search" />

        <v-card>
            <v-data-table
                v-model="selectedItems"
                item-key="id"
                :headers="headers"
                :items="publications"
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

                <template #item.url="{ item }">
                    <div style="max-width: 300px;">
                        {{ item.url }}
                    </div>
                </template>

                <template #item.published_at="{ item }">
                    <div v-if="item.published_at">{{ item.asDate('published_at').fromNow() }}</div>
                </template>

                <template #item.action="{ item }">
                    <div class="table-actions">
                        <v-btn icon target="_blank" link :href="`${item.url}`">
                            <external-link-icon />
                        </v-btn>
                        <v-btn
                            icon
                            width="22"
                            height="22"
                            class="mx-1"
                            :to="{ name: 'publications.update', params: { id: item.id } }"
                        >
                            <pencil-alt-icon />
                        </v-btn>
                        <v-btn icon @click.prevent="deletePublication(item)">
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
import Publication from '../models/Publication';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        PageHeader,
        AdvancedSearchForm,
    },
    mixins: [DatatableMixin],
    data() {
        return {
            publications: [],
            searchForm: {
                name: null,
                is_enabled: null,
            },
            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Название', align: 'left', value: 'name' },
                { text: 'Ссылка', align: 'left', value: 'url' },
                { text: 'Источник', align: 'left', value: 'source' },
                { text: 'Дата публикации', align: 'left', value: 'published_at' },
                { text: '', sortable: false, align: 'right', value: 'action' },
            ],
            breadcrumbs: [{ text: 'Список публикаций' }],
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
                    label: 'Отображается на сайте',
                    name: 'is_enabled',
                    component: () => import('@/components/search/fields/BooleanSelectSearchField'),
                },
            ],
        };
    },
    async fetch() {
        this.showLoading();

        const response = await Publication.select({
            publications: ['id', 'name', 'url', 'source', 'published_at'],
        })
            .params(this.queryParams)
            .get();

        this.publications = Publication.hydrate(response.data);

        this.setTotal(response.meta.total);
        this.hideLoading();
    },
    head: {
        title: 'Публикации',
    },
    methods: {
        async deletePublication(publication) {
            if (!(await this.$confirm(`Вы действительно хотите удалить публикацию ${publication.name}?`))) {
                return;
            }
            try {
                await publication.delete();

                this.$snackbar(`Публикациа ${publication.name} успешно удален`);
                this.publications = this.publications.filter((item) => item.id !== publication.id);
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
