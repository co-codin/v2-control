<template>
    <div>
        <page-header h1="Редактирование проекта" :breadcrumbs="breadcrumbs" />
        <template v-if="!$fetchState.pending">
            <v-expansion-panels>
                <form-block title="Основная информация">
                    <case-form :case-item="caseItem" is-updating @send="updateCase" />
                </form-block>
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
import CaseForm from '../components/CaseForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        PageHeader,
        CaseForm,
    },
    data: () => ({
        caseItem: null,
        isLoading: true,
        breadcrumbs: [{ text: 'Список проектов', to: { name: 'cases.index' } }, { text: 'Редактирование проекта' }],
    }),
    async fetch() {
        const { data } = await this.$axios.get(`/cases/${this.$route.params.id}`, {
            params: {
                include: ['city'],
            },
        });
        this.caseItem = data.data;
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование проекта',
    },
    methods: {
        async updateCase(form) {
            try {
                await form.put(`/admin/cases/${this.$route.params.id}`);
                this.$snackbar(`Проект успешно обновлен`);
                await this.$router.push({ name: 'cases.index' });
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении проекта: ${e.message}`);
            }
        },
    },
};
</script>
