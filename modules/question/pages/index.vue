<template>
    <div>
        <page-header h1="Вопросы" :breadcrumbs="breadcrumbs"></page-header>

        <div v-if="$can('create questions') || $can('view question categories')" class="mb-2">
            <v-btn v-if="$can('create questions')" :to="{ name: 'questions.create' }"> Добавить вопрос </v-btn>
            <v-btn v-if="$can('view question categories')" class="ml-2" :to="{ name: 'question-categories.index' }"> Категории вопросов </v-btn>
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
                    <div class="table-actions">
                        <v-btn icon target="_blank" link :href="`${$config.app.siteUrl}/page/questions#${item.slug}`">
                            <external-link-icon />
                        </v-btn>
                        <v-btn
                            v-if="$can('edit questions')"
                            icon
                            width="22"
                            height="22"
                            class="mx-1"
                            :to="{ name: 'questions.update', params: { id: item.id } }"
                        >
                            <pencil-alt-icon />
                        </v-btn>
                        <v-btn v-if="$can('delete questions')" icon @click.prevent="deleteQuestion(item)">
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
                { text: 'Категория', value: 'question_category.name', sortable: false },
                { text: 'Статус', value: 'status.description', sortable: false },
                { text: '', sortable: false, align: 'right', value: 'action' },
            ],
            breadcrumbs: [{ text: 'Список вопросов' }],
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
            questions: ['id', 'question', 'slug', 'status', 'question_category_id'],
        })
            .with('questionCategory')
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
