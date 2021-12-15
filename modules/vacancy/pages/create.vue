<template>
    <div>
        <page-header h1="Добавление вакансии" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <form-block title="Основная информация">
                <vacancy-form @send="createVacancy" />
            </form-block>
        </v-expansion-panels>
    </div>
</template>

<script>
import PageHeader from '~/components/common/PageHeader';
import VacancyForm from '~/modules/vacancy/components/VacancyForm';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        VacancyForm,
        PageHeader,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Список вакансий', to: { name: 'vacancies.index' } },
            { text: 'Добавление вакансии' },
        ],
    }),
    head: {
        title: 'Добавление вакансии',
    },
    methods: {
        async createVacancy(form) {
            try {
                await form.post('/admin/vacancies');
                this.$snackbar(`Вакансия ${form.name} успешно добавлена`);
                await this.$router.push({ name: 'vacancies.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании вакансии: ${e.message}`);
            }
        },
    },
};
</script>
