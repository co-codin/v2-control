<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex align-center py-3">
            <div>
                <div class="display-1">Добавление публикации</div>
                <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
            </div>
        </div>

        <v-card class="pa-2">
            <publication-form @send="createPublication">
                <template slot="buttons">
                    <v-btn type="submit">Добавить</v-btn>
                </template>
            </publication-form>
        </v-card>
    </div>
</template>

<script>
import PublicationForm from '../components/PublicationForm';

export default {
    components: {
        PublicationForm,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список публикаций', href: '/publications' },
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
                this.$snackbar(`Публикация ${form.name} успешно добавлена`);
                await this.$router.push({ name: 'publications.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании публикации: ${e.message}`);
            }
        },
    },
};
</script>
