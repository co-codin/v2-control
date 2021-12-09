<template>
    <div>
        <page-header h1="Редактирование страницы" :breadcrumbs="breadcrumbs" />
        <template v-if="page && !$fetchState.pending">
            <v-expansion-panels>
                <form-block title="Основная информация">
                    <page-form :page="page" is-updating @send="updatePage" />
                </form-block>
                <form-block title="SEO">
                    <seo-relation-form :seo="seo" @send="updatePageSeo" />
                </form-block>
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
import PageForm from '../components/PageForm';
import SeoRelationForm from '@/components/forms/SeoRelationForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        PageHeader,
        SeoRelationForm,
        PageForm,
    },
    data: () => ({
        page: null,
        seo: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список страниц', href: '/pages' },
            { text: 'Редактирование страницы' },
        ],
    }),
    async fetch() {
        const { data } = await this.$axios.get(`/pages/${this.$route.params.id}`, {
            params: {
                include: ['seo'],
            },
        });
        data.data.status = data.data.status.value;
        this.seo = data.data.seo || {};
        this.page = data.data;
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование страницы',
    },
    methods: {
        async updatePage(form) {
            try {
                await form.put(`/admin/pages/${this.$route.params.id}`);
                this.$snackbar(`Страницы успешно обновлена`);
                await this.$router.push({ name: 'pages.index' });
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении страницы: ${e.message}`);
            }
        },
        async updatePageSeo(form) {
            try {
                await form.patch(`/admin/pages/${this.$route.params.id}/seo`);
                this.$snackbar(`SEO страницы успешно обновлено`);
                await this.$router.push({ name: 'pages.index' });
            } catch (e) {
                this.$snackbar(`Прозиошла ошибка при обоновлении seo у страницы: ${e.message}`);
            }
        },
    },
};
</script>
