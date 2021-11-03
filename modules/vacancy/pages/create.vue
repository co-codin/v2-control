<template>
    <div>
        <page-header h1="Добавление вакансии" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <vacancy-form @send="createVacancy" />
        </v-expansion-panels>
    </div>
</template>

<script>
import PageHeader from '~/components/common/PageHeader';
import VacancyForm from '~/modules/vacancy/components/VacancyForm';

export default {
    components: {
        VacancyForm,
        PageHeader,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список вакансий', href: '/vacancies' },
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
