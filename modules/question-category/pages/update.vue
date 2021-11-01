<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex align-center py-3">
            <div>
                <div class="display-1">Редактирование достижения</div>
                <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
            </div>
        </div>

        <v-card :loading="isLoading" class="mb-3">
            <v-card-title> Основная информация </v-card-title>
            <v-card-text v-if="question_category">
                <question-category-form
                    :question-category="question_category"
                    is-updating
                    @send="updateQuestionCategory"
                />
            </v-card-text>
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
        question_category: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список категорий вопросов', href: '/question-categories' },
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
