<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex align-center py-3">
            <div>
                <div class="display-1">Добавление категории</div>
                <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
            </div>
        </div>

        <v-card class="pa-2">
            <question-category-form @send="createQuestionCategory">
                <template slot="buttons">
                    <v-btn type="submit">Добавить</v-btn>
                </template>
            </question-category-form>
        </v-card>
    </div>
</template>

<script>
import QuestionCategoryForm from '../components/QuestionCategoryForm';

export default {
    components: {
        QuestionCategoryForm,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список категорий', href: '/question-categories' },
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
