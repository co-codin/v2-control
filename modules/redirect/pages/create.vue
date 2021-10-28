<template>
    <div>
        <page-header h1="Добавление редиректа" :breadcrumbs="breadcrumbs" />
        <redirect-form @send="createRedirect" />
    </div>
</template>

<script>
import RedirectForm from '../components/RedirectForm';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        RedirectForm,
        PageHeader,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Редиректы', href: '/redirects' },
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
