<template>
    <div>
        <page-header h1="Редактирование категории вопроса" :breadcrumbs="breadcrumbs" />
        <template v-if="!$fetchState.pending">
            <v-expansion-panels>
                <form-block title="Основная информация">
                    <question-category-form
                        :question-category="question_category"
                        is-updating
                        @send="updateQuestionCategory"
                    />
                </form-block>
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
import QuestionCategoryForm from '../components/QuestionCategoryForm';
import FormBlock from '~/components/forms/FormBlock';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        PageHeader,
        FormBlock,
        QuestionCategoryForm,
    },
    data: () => ({
        question_category: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Список категорий вопросов', to: { name: 'question-categories.index' } },
            { text: 'Редактирование категории вопросов' },
        ],
    }),
    async fetch() {
        const { data } = await this.$axios.get(`/question-categories/${this.$route.params.id}`);
        this.question_category = data.data;
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование категории вопросов',
    },
    methods: {
        async updateQuestionCategory(form) {
            try {
                await form.put(`/admin/question-categories/${this.$route.params.id}`);
                this.$snackbar(`Категория успешно обновлено`);
                await this.$router.push({ name: 'question-categories.index' });
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении категории: ${e.message}`);
            }
        },
    },
};
</script>
