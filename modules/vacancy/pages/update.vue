<template>
    <div>
        <page-header h1="Редактирование производителя" :breadcrumbs="breadcrumbs" />
        <template v-if="!$fetchState.pending">
            <v-expansion-panels>
                <form-block title="Основная информация">
                    <vacancy-form :vacancy="vacancy" is-updating @send="updateVacancy" />
                </form-block>
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
import VacancyForm from '../components/VacancyForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        PageHeader,
        VacancyForm,
    },
    data: () => ({
        vacancy: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Список вакансий', to: { name: 'vacancies.index' } },
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
