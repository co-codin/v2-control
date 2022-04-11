<template>
    <div>
        <page-header h1="Добавление проекта" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <form-block title="Основная информация">
                <case-form @send="createCase" />
            </form-block>
        </v-expansion-panels>
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
        breadcrumbs: [{ text: 'Список проектов', to: { name: 'cases.index' } }, { text: 'Добавление проекта' }],
    }),
    head: {
        title: 'Добавление проекта',
    },
    methods: {
        async createCase(form) {
            try {
                await form.post('/admin/cases');
                this.$snackbar(`Проект ${form.name} успешно добавлен`);
                await this.$router.push({ name: 'cases.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании проекта: ${e.message}`);
            }
        },
    },
};
</script>
