<template>
    <div>
        <page-header h1="Редактирование вопроса" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels v-if="question">
            <question-form :question="question" is-updating @send="updateQuestion" />
        </v-expansion-panels>
    </div>
</template>

<script>
import QuestionForm from '../components/QuestionForm';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        PageHeader,
        QuestionForm,
    },
    data: () => ({
        question: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список вопросов', href: '/questions' },
            { text: 'Редактирование вопроса' },
        ],
    }),
    async fetch() {
        const { data } = await this.$axios.get(`/questions/${this.$route.params.id}`);
        data.data.status = data.data.status.value;
        this.question = data.data;
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование вопроса',
    },
    methods: {
        async updateQuestion(form) {
            try {
                await form.put(`/admin/questions/${this.$route.params.id}`);
                this.$snackbar(`Вопрос успешно обновлен`);
                await this.$router.push({ name: 'questions.index' });
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении вопроса: ${e.message}`);
            }
        },
    },
};
</script>
