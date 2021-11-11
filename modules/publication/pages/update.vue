<template>
    <div>
        <page-header h1="Редактирование публикации" :breadcrumbs="breadcrumbs" />
        <template v-if="publication && !$fetchState.pending">
            <v-expansion-panels>
                <form-block title="Основная информация">
                    <publication-form :publication="publication" is-updating @send="updatePublication" />
                </form-block>
                <form-block title="SEO">
                    <seo-relation-form :seo="seo" @send="updatePublicationSeo" />
                </form-block>
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
import PublicationForm from '../components/PublicationForm';
import SeoRelationForm from '@/components/forms/SeoRelationForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        PageHeader,
        SeoRelationForm,
        PublicationForm,
    },
    data: () => ({
        publication: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список публикаций', href: '/publications' },
            { text: 'Редактирование публикации' },
        ],
    }),
    async fetch() {
        const { data } = await this.$axios.get(`/publications/${this.$route.params.id}`, {
            params: {
                include: ['seo'],
            },
        });
        this.seo = data.data.seo || {};
        this.publication = data.data;
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование публикации',
    },
    methods: {
        async updatePublication(form) {
            try {
                await form.put(`/admin/publications/${this.$route.params.id}`);
                this.$snackbar(`Публикация успешно обновлен`);
                await this.$router.push({ name: 'publications.index' });
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении публикации: ${e.message}`);
            }
        },
        async updatePublicationSeo(form) {
            try {
                await form.patch(`/admin/publications/${this.$route.params.id}/seo`);
                this.$snackbar(`SEO публикации успешно обновлено`);
                await this.$router.push({ name: 'publications.index' });
            } catch (e) {
                this.$snackbar(`Прозиошла ошибка при обоновлении seo у публикации: ${e.message}`);
            }
        },
    },
};
</script>
