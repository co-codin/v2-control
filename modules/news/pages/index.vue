<template>
    <div>
        <page-header h1="Новости" :breadcrumbs="breadcrumbs"></page-header>

        <div class="mb-2">
            <v-btn :to="{ name: 'news.create' }"> Добавить новость </v-btn>
        </div>

        <advanced-search-form fast-filter-name="live" :filters="filters" :value="searchForm" @search="search" />

        <v-card>
            <v-data-table
                v-model="selectedItems"
                item-key="id"
                :headers="headers"
                :items="news"
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

                <template #item.status="{ item }">
                    <div class="font-weight-bold text-no-wrap">
                        {{ statusLabels.find((el) => el.value === item.status).text }}
                    </div>
                </template>

                <template #item.published_at="{ item }">
                    <div v-if="item.published_at">{{ item.asDate('published_at').fromNow() }}</div>
                </template>

                <template #item.is_in_home="{ item }">
                    <div>{{ item.is_in_home ? 'Да' : 'Нет' }}</div>
                </template>

                <template #item.action="{ item }">
                    <div class="actions text-no-wrap">
                        <v-btn
                            icon
                            width="22"
                            height="22"
                            target="_blank"
                            link
                            :href="`${$config.app.siteUrl}/news/${item.slug}`"
                        >
                            <external-link-icon class="h-6 w-6" />
                        </v-btn>
                        <v-btn
                            icon
                            width="22"
                            height="22"
                            class="mx-1"
                            :to="{ name: 'news.update', params: { id: item.id } }"
                        >
                            <pencil-alt-icon class="h-6 w-6" />
                        </v-btn>
                        <v-btn icon width="22" height="22" @click.prevent="deleteNews(item)">
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
import { statusLabels } from '@/enums';
import News from '../models/News';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        PageHeader,
        AdvancedSearchForm,
    },
    mixins: [DatatableMixin],
    data() {
        return {
            news: [],
            statusLabels,
            searchForm: {
                name: null,
                is_in_home: null,
                status: null,
            },
            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Название', align: 'left', value: 'name' },
                { text: 'Ссылка', align: 'left', value: 'slug' },
                { text: 'Рубрика', align: 'left', value: 'category' },
                { text: 'Дата новости', align: 'left', value: 'published_at' },
                { text: 'Статус', value: 'status' },
                { text: 'На главной', value: 'is_in_home' },
                { text: '', sortable: false, align: 'right', value: 'action' },
            ],
            breadcrumbs: [{ text: 'Главная', href: '/' }, { text: 'Список новостей' }],
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
                    name: 'slug',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'Статус',
                    name: 'status',
                    component: () => import('@/components/search/fields/SelectSearchField'),
                    items: statusLabels,
                },
                {
                    label: 'Отображается на главной',
                    name: 'is_in_home',
                    component: () => import('@/components/search/fields/BooleanSelectSearchField'),
                },
                {
                    label: 'Рубрика',
                    name: 'category',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
            ],
        };
    },
    async fetch() {
        this.showLoading();

        const response = await News.select({
            news: ['id', 'name', 'slug', 'status', 'published_at', 'is_in_home', 'category'],
        })
            .params(this.queryParams)
            .get();

        this.news = News.hydrate(response.data);

        this.setTotal(response.meta.total);
        this.hideLoading();
    },
    head: {
        title: 'Новости',
    },
    methods: {
        async deleteNews(news) {
            if (!(await this.$confirm(`Вы действительно хотите удалить новость ${news.name}?`))) {
                return;
            }
            try {
                await news.delete();

                this.$snackbar(`Новость ${news.name} успешно удалена`);
                this.news = this.news.filter((item) => item.id !== news.id);
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
