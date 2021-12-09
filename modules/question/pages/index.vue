<template>
    <div>
        <page-header h1="Вопросы" :breadcrumbs="breadcrumbs"></page-header>

        <div class="mb-2">
            <v-btn :to="{ name: 'questions.create' }"> Добавить вопрос </v-btn>
            <v-btn class="ml-2" :to="{ name: 'question-categories.index' }"> Категории вопросов </v-btn>
        </div>

        <advanced-search-form fast-filter-name="live" :filters="filters" :value="searchForm" @search="search" />

        <v-card>
            <v-data-table
                v-model="selectedItems"
                item-key="id"
                :headers="headers"
                :items="questions"
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

                <template #item.created_at="{ item }">
                    <div>{{ item.asDate('created_at').fromNow() }}</div>
                </template>

                <template #item.action="{ item }">
                    <div class="actions text-no-wrap">
                        <v-btn
                            icon
                            width="22"
                            height="22"
                            class="mx-1"
                            :to="{ name: 'questions.update', params: { id: item.id } }"
                        >
                            <pencil-alt-icon class="h-6 w-6" />
                        </v-btn>
                        <v-btn icon width="22" height="22" @click.prevent="deleteQuestion(item)">
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
import Question from '../models/Question';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        AdvancedSearchForm,
        PageHeader,
    },
    mixins: [DatatableMixin],
    data() {
        return {
            questions: [],
            searchForm: {
                question: null,
                slug: null,
                status: null,
            },
            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Вопрос', align: 'left', value: 'question' },
                { text: 'Ссылка', align: 'left', value: 'slug' },
                { text: 'Ответ', align: 'left', value: 'answer' },
                { text: 'Категория', value: 'question_category.name', sortable: false },
                { text: 'Статус', value: 'status.description', sortable: false },
                { text: '', sortable: false, align: 'right', value: 'action' },
            ],
            breadcrumbs: [{ text: 'Главная', href: '/' }, { text: 'Список вопросов' }],
            filters: [
                {
                    label: 'Быстрый поиск',
                    name: 'live',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'Вопрос',
                    name: 'question',
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
            ],
        };
    },
    async fetch() {
        this.showLoading();

        const response = await Question.select({
            questions: ['id', 'question', 'slug', 'answer', 'status', 'question_category_id'],
        })
            .with('question_category')
            .params(this.queryParams)
            .get();

        this.questions = Question.hydrate(response.data);

        this.setTotal(response.meta.total);
        this.hideLoading();
    },
    head: {
        title: 'Вопросы',
    },
    methods: {
        async deleteQuestion(question) {
            if (!(await this.$confirm(`Вы действительно хотите удалить вопрос ${question.question}?`))) {
                return;
            }
            try {
                await question.delete();

                this.$snackbar(`Вопрос ${question.question} успешно удалена`);
                this.questions = this.questions.filter((item) => item.id !== question.id);
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
