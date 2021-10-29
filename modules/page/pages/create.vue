<template>
    <div>
        <page-header h1="Добавление страницы" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <page-form @send="createPage" />
        </v-expansion-panels>
    </div>
</template>

<script>
import PageForm from '../components/PageForm';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        PageHeader,
        PageForm,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список страниц', href: '/pages' },
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
