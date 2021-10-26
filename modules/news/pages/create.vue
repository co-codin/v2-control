<template>
    <div>
        <page-header h1="Добавление новости" :breadcrumbs="breadcrumbs"></page-header>
        <v-card class="pa-2">
            <news-form @send="createNews">
                <template slot="buttons">
                    <v-btn type="submit">Добавить</v-btn>
                </template>
            </news-form>
        </v-card>
    </div>
</template>

<script>
import NewsForm from '../components/NewsForm';
import PageHeader from "~/components/common/PageHeader";

export default {
    components: {
        PageHeader,
        NewsForm,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список новостей', href: '/news' },
            { text: 'Добавление новости' },
        ],
    }),
    head: {
        title: 'Добавление новости',
    },
    methods: {
        async createNews(form) {
            try {
                await form.post('/admin/news');
                this.$snackbar(`Новость ${form.name} успешно добавлена`);
                await this.$router.push({ name: 'news.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании новости: ${e.message}`);
            }
        },
    },
};
</script>
