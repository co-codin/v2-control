<template>
    <div>
        <page-header h1="Редактирование вопроса" :breadcrumbs="breadcrumbs" />
        <template v-if="!$fetchState.pending">
            <v-expansion-panels>
                <form-block title="Основная информация">
                    <question-form :question="question" is-updating @send="updateQuestion" />
                </form-block>
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
import QuestionForm from '../components/QuestionForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
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
