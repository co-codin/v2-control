<template>
    <div>
        <page-header h1="Добавление вопроса" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <form-block title="Основная информация">
                <question-form @send="createQuestion" />
            </form-block>
        </v-expansion-panels>
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
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список вопросов', href: '/questions' },
            { text: 'Добавление вопроса' },
        ],
    }),
    head: {
        title: 'Добавление вопроса',
    },
    methods: {
        async createQuestion(form) {
            try {
                await form.post('/admin/questions');
                this.$snackbar(`Вопрос ${form.name} успешно добавлен`);
                await this.$router.push({ name: 'questions.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании вопроса: ${e.message}`);
            }
        },
    },
};
</script>
