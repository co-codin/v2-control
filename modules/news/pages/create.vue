<template>
    <div>
        <page-header h1="Добавление новости" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <form-block title="Основная информация">
                <news-form @send="createNews" />
            </form-block>
        </v-expansion-panels>
    </div>
</template>

<script>
import NewsForm from '../components/NewsForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
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
