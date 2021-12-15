<template>
    <div>
        <page-header h1="Добавление страницы" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <form-block title="Основная информация">
                <page-form @send="createPage" />
            </form-block>
        </v-expansion-panels>
    </div>
</template>

<script>
import PageForm from '../components/PageForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        PageHeader,
        PageForm,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Список страниц', to: { name: 'pages.index' } },
            { text: 'Добавление страницы' },
        ],
    }),
    head: {
        title: 'Добавление страницы',
    },
    methods: {
        async createPage(form) {
            try {
                await form.post('/admin/pages');
                this.$snackbar(`Страницы ${form.name} успешно добавлена`);
                await this.$router.push({ name: 'pages.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании страницы: ${e.message}`);
            }
        },
    },
};
</script>
