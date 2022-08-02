<template>
    <div>
        <page-header h1="Добавление кейса" :breadcrumbs="breadcrumbs" />
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
        breadcrumbs: [{ text: 'Список кейсов', to: { name: 'cases.index' } }, { text: 'Добавление кейса' }],
    }),
    head: {
        title: 'Добавление кейса',
    },
    methods: {
        async createCase(form) {
            try {
                await form.post('/admin/case_models');
                this.$snackbar(`Кейс "${form.name}" успешно добавлен`);
                await this.$router.push({ name: 'cases.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании: ${e.message}`);
            }
        },
    },
};
</script>
