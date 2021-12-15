<template>
    <div>
        <page-header h1="Добавление категории вопроса" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <form-block title="Основная информация">
                <question-category-form @send="createQuestionCategory" />
            </form-block>
        </v-expansion-panels>
    </div>
</template>

<script>
import QuestionCategoryForm from '../components/QuestionCategoryForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        PageHeader,
        QuestionCategoryForm,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Список категорий', to: { name: 'question-categories.index' } },
            { text: 'Добавление категории' },
        ],
    }),
    head: {
        title: 'Добавление категории',
    },
    methods: {
        async createQuestionCategory(form) {
            try {
                await form.post('/admin/question-categories');
                this.$snackbar(`Категория ${form.name} успешно добавлена`);
                await this.$router.push({ name: 'question-categories.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании категории: ${e.message}`);
            }
        },
    },
};
</script>
