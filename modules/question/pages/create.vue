<template>
    <div>
        <page-header h1="Добавление вопроса" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <question-form @send="createQuestion" />
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
        async createBrand(form) {
            try {
                await form.post('/admin/brands');
                this.$snackbar(`Производитель ${form.name} успешно добавлен`);
                await this.$router.push({ name: 'brands.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании производителя: ${e.message}`);
            }
        },
    },
};
</script>
