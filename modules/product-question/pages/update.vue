<template>
    <div>
        <page-header h1="Редактирование вопроса" :breadcrumbs="breadcrumbs" />
        <template v-if="!$fetchState.pending">
            <div v-if="$can('edit product questions')" class="mb-2">
                <v-btn
                    v-if="!question.isApproved"
                    color="green"
                    outlined
                    small
                    @click="approveQuestion(question)"
                >
                    <check-circle-icon class="h-6 w-6 mr-1" />
                    Одобрить
                </v-btn>
                <v-btn
                    v-if="!question.isRejected"
                    color="red"
                    outlined
                    small
                    @click="rejectQuestion(question)"
                >
                    <x-circle-icon class="h-6 w-6 mr-1" />
                    Отклонить
                </v-btn>
            </div>
             <v-expansion-panels :value="0">
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
import ProductQuestion from "~/modules/product-question/models/ProductQuestion";
import CheckCircleIcon from '~/components/heroicons/CheckCircleIcon';
import XCircleIcon from '~/components/heroicons/XCircleIcon';

export default {
    components: {
        FormBlock,
        PageHeader,
        ProductQuestionForm,
        CheckCircleIcon,
        XCircleIcon,
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
        this.question = await ProductQuestion.$find(this.$route.params.id);
        this.question.status = this.question.status.value;
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование вопроса',
    },
    methods: {
        async updateQuestion(form) {
            try {
                await form.put(`/admin/product-questions/${this.question.id}`);
                this.$snackbar(`Вопрос к товару успешно обновлен`);
                await this.$nuxt.refresh();
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении: ${e.message}`);
            }
        },
        async approveQuestion(question) {
            if (!(await this.$confirm(`Вы действительно хотите одобрить вопрос?`))) {
                return;
            }
            try {
                await question.approve();
                this.$snackbar(`Вопрос успешно одобрен`);
                await this.$nuxt.refresh();
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
        async rejectQuestion(question) {
            if (!(await this.$confirm(`Вы действительно хотите отклонить вопрос?`))) {
                return;
            }
            try {
                await question.reject();
                this.$snackbar(`Вопрос успешно отклонен`);
                await this.$nuxt.refresh();
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
