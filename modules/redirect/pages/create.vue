<template>
    <div>
        <page-header h1="Добавление редиректа" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <form-block title="Основная информация">
                <redirect-form @send="createRedirect" />
            </form-block>
        </v-expansion-panels>
    </div>
</template>

<script>
import RedirectForm from '../components/RedirectForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        RedirectForm,
        PageHeader,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Список редиректов', to: { name: 'redirects.index' } },
            { text: 'Добавление редиректа' },
        ],
    }),
    head: {
        title: 'Добавление редиректов',
    },
    methods: {
        async createRedirect(form) {
            try {
                await form.post('/admin/redirects');
                this.$snackbar(`Редирект успешно добавлен`);
                await this.$router.push({ name: 'redirects.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при сохранении: ${e.message}`);
            }
        },
    },
};
</script>
