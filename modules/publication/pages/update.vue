<template>
    <div>
        <page-header h1="Редактирование публикации" :breadcrumbs="breadcrumbs" />
        <template v-if="publication && !$fetchState.pending">
            <v-expansion-panels :value="0">
                <form-block title="Основная информация">
                    <publication-form :publication="publication" is-updating @send="updatePublication" />
                </form-block>
            </v-expansion-panels>
        </template>
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
        publication: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Список публикаций', to: { name: 'publications.index' } },
            { text: 'Редактирование публикации' },
        ],
    }),
    async fetch() {
        const { data } = await this.$axios.get(`/publications/${this.$route.params.id}`);
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
                this.$snackbar(`Публикация успешно обновлена`);
                await this.$router.push({ name: 'publications.index' });
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении публикации: ${e.message}`);
            }
        },
    },
};
</script>
