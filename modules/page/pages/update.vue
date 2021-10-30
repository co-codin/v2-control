<template>
    <div>
        <page-header h1="Редактирование страницы" :breadcrumbs="breadcrumbs"></page-header>
        <v-expansion-panels v-if="page">
            <page-form :page="page" is-updating @send="updatePage" />
            <seo-relation-form :seo="seo" @send="updatePageSeo" />
        </v-expansion-panels>
    </div>
</template>

<script>
import PageForm from '../components/PageForm';
import SeoRelationForm from '@/components/forms/SeoRelationForm';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
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
