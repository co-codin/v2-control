<template>
    <div>
        <page-header h1="Редактирование вопроса" :breadcrumbs="breadcrumbs" />
        <template v-if="!$fetchState.pending">
            <v-expansion-panels>
                <form-block title="Основная информация">
                    <product-question-form
                        :question="question"
                        is-updating
                        @send="updateQuestion"
                    />
                </form-block>
            </v-expansion-panels>
        </template>
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
        question: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Список вопросов к товарам', to: { name: 'product-questions.index' } },
            { text: 'Редактирование вопроса' },
        ],
    }),
    async fetch() {
        const { data } = await this.$axios.get(`/product-questions/${this.$route.params.id}`);
        this.question = data.data;
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование вопроса',
    },
    methods: {
        async updateQuestion(form) {
            try {
                await form.put(`/admin/product-questions/${this.$route.params.id}`);
                this.$snackbar(`Вопрос к товару успешно обновлен`);
                await this.$router.push({ name: 'product-questions.index' });
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении: ${e.message}`);
            }
        },
    },
};
</script>
