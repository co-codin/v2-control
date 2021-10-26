<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex align-center py-3">
            <div>
                <div class="display-1">Добавление новости</div>
                <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
            </div>
        </div>

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

export default {
    components: {
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
