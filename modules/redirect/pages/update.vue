<template>
    <div>
        <page-header h1="Редактирование редиректа" :breadcrumbs="breadcrumbs" />
        <redirect-form v-if="redirect" :seo-rule="redirect" is-updating @send="updateRedirect" />
    </div>
</template>

<script>
import Redirect from '~/modules/redirect/models/Redirect';
import RedirectForm from "~/modules/redirect/components/RedirectForm";
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        RedirectForm,
        PageHeader,
    },
    data: () => ({
        redirect: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Редиректы', href: '/redirects' },
            { text: 'Редактирование редиректа' },
        ],
    }),
    async fetch() {
        this.redirect = await Redirect.$find(this.$route.params.id);
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование редиректа',
    },
    methods: {
        async updateRedirect(form) {
            try {
                await form.put(`/admin/redirects/${this.$route.params.id}`);
                this.$snackbar(`Редирект успешно обновлен`);
                await this.$router.push({ name: 'redirects.index' });
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении: ${e.message}`);
            }
        },
    },
};
</script>
