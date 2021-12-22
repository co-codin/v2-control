<template>
    <div>
        <page-header h1="Добавление вопроса" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <form-block title="Основная информация">
                <product-question-form @send="createQuestion" />
            </form-block>
        </v-expansion-panels>
    </div>
</template>

<script>
import ProductQuestionForm from '../components/ProductQuestionForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        PageHeader,
        ProductQuestionForm,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Список вопросов к товарам', to: { name: 'product-questions.index' } },
            { text: 'Добавление вопроса' },
        ],
    }),
    head: {
        title: 'Добавление вопроса',
    },
    methods: {
        async createQuestion(form) {
            try {
                const { data } = await form.post('/admin/product-questions');
                this.$snackbar(`Вопрос к товару успешно добавлен`);
                await this.$router.push({ name: 'product-questions.update', params: { id: data.id } });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании: ${e.message}`);
            }
        },
    },
};
</script>
