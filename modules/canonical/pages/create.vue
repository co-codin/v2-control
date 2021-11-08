<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex align-center py-3">
            <div>
                <div class="display-1">Добавление канонической ссылки</div>
                <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
            </div>
        </div>

        <v-card class="pa-2">
            <canonical-form @send="createCanonical">
                <template slot="buttons">
                    <v-btn type="submit">Добавить</v-btn>
                </template>
            </canonical-form>
        </v-card>
    </div>
</template>

<script>
import CanonicalForm from '../components/CanonicalForm';

export default {
    components: {
        CanonicalForm,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список канонических ссылок', href: '/canonicals' },
            { text: 'Добавление канонической ссылки' },
        ],
    }),
    head: {
        title: 'Добавление канонической ссылки',
    },
    methods: {
        async createCanonical(form) {
            try {
                await form.post('/admin/canonicals');
                this.$snackbar(`Каноническая ссылка ${form.name} успешно добавлена`);
                await this.$router.push({ name: 'canonicals.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при канонической ссылки: ${e.message}`);
            }
        },
    },
};
</script>
