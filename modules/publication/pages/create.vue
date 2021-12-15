<template>
    <div>
        <page-header h1="Добавление публикации" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <form-block title="Основная информация">
                <publication-form @send="createPublication" />
            </form-block>
        </v-expansion-panels>
    </div>
</template>

<script>
import PublicationForm from '../components/PublicationForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        PageHeader,
        PublicationForm,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Список публикаций', to: { name: 'publications.index' } },
            { text: 'Добавление публикации' },
        ],
    }),
    head: {
        title: 'Добавление публикации',
    },
    methods: {
        async createPublication(form) {
            try {
                await form.post('/admin/publications');
                this.$snackbar(`Публикация успешно добавлена`);
                await this.$router.push({ name: 'publications.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании публикации: ${e.message}`);
            }
        },
    },
};
</script>
