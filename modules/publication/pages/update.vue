<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex align-center py-3">
            <div>
                <div class="display-1">Редактирование публикации</div>
                <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
            </div>
        </div>

        <v-card :loading="isLoading" class="mb-3">
            <v-card-title> Основная информация </v-card-title>
            <v-card-text v-if="publication">
                <publication-form :publication="publication" is-updating @send="updatePublication" />
            </v-card-text>
        </v-card>

        <v-card :loading="isLoading">
            <v-card-title> SEO </v-card-title>
            <v-card-text v-if="publication">
                <seo-relation-form :seo="seo" @send="updatePublicationSeo" />
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import PublicationForm from '../components/PublicationForm';
import SeoRelationForm from '@/components/forms/SeoRelationForm';

export default {
    components: {
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
