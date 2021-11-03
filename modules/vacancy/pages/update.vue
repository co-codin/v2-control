<template>
    <div>
        <page-header h1="Редактирование вакансии" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels v-if="vacancy">
            <vacancy-form :vacancy="vacancy" is-updating @send="updateVacancy" />
        </v-expansion-panels>
    </div>
</template>

<script>
import VacancyForm from '../components/VacancyForm';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        PageHeader,
        VacancyForm,
    },
    data: () => ({
        vacancy: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список вакансий', href: '/vacancies' },
            { text: 'Редактирование вакансии' },
        ],
    }),
    async fetch() {
        const { data } = await this.$axios.get(`/vacancies/${this.$route.params.id}`);
        data.data.status = data.data.status.value;
        this.vacancy = data.data;
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование вакансии',
    },
    methods: {
        async updateVacancy(form) {
            try {
                await form.put(`/admin/vacancies/${this.$route.params.id}`);
                this.$snackbar(`Вакансия успешно обновлена`);
                await this.$router.push({ name: 'vacancies.index' });
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении вакансии: ${e.message}`);
            }
        },
    },
};
</script>
