<template>
    <div>
        <page-header h1="Редактирование редиректа" :breadcrumbs="breadcrumbs" />
        <template v-if="!$fetchState.pending">
            <v-expansion-panels>
                <form-block title="Основная информация">
                    <redirect-form v-if="redirect" :redirect="redirect" is-updating @send="updateRedirect" />
                </form-block>
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
import Redirect from '~/modules/redirect/models/Redirect';
import RedirectForm from '~/modules/redirect/components/RedirectForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
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
