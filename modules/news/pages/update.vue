<template>
    <div>
        <page-header h1="Редактирование новости" :breadcrumbs="breadcrumbs" />
        <template v-if="news && !$fetchState.pending">
            <v-expansion-panels>
                <form-block title="Основная информация">
                    <news-form :news="news" is-updating @send="updateNews" />
                </form-block>
                <form-block title="SEO">
                    <seo-relation-form :seo="seo" @send="updateNewsSeo" />
                </form-block>
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
import NewsForm from '../components/NewsForm';
import SeoRelationForm from '@/components/forms/SeoRelationForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        PageHeader,
        SeoRelationForm,
        NewsForm,
    },
    data: () => ({
        news: null,
        seo: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список новостей', href: '/news' },
            { text: 'Редактирование новости' },
        ],
    }),
    async fetch() {
        const { data } = await this.$axios.get(`/news/${this.$route.params.id}`, {
            params: {
                include: ['seo'],
            },
        });
        data.data.status = data.data.status.value;
        this.seo = data.data.seo || {};
        this.news = data.data;
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование новости',
    },
    methods: {
        async updateNews(form) {
            try {
                await form.put(`/admin/news/${this.$route.params.id}`);
                this.$snackbar(`Новость успешно обновлена`);
                await this.$router.push({ name: 'news.index' });
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении новости: ${e.message}`);
            }
        },
        async updateNewsSeo(form) {
            try {
                await form.patch(`/admin/news/${this.$route.params.id}/seo`);
                this.$snackbar(`SEO новости успешно обновлено`);
                await this.$router.push({ name: 'news.index' });
            } catch (e) {
                this.$snackbar(`Прозиошла ошибка при обоновлении seo у новости: ${e.message}`);
            }
        },
    },
};
</script>
