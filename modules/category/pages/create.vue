<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex align-center py-3">
            <div>
                <div class="display-1">Добавление категории</div>
                <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
            </div>
        </div>

        <v-card class="pa-2">
            <category-form @send="createCategory">
                <template slot="buttons">
                    <v-btn type="submit">Добавить</v-btn>
                </template>
            </category-form>
        </v-card>
    </div>
</template>

<script>
import CategoryForm from '../components/CategoryForm';

export default {
    components: {
        CategoryForm,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список категорий', href: '/categories' },
            { text: 'Добавление категории' },
        ],
    }),
    head: {
        title: 'Добавление категории',
    },
    methods: {
        async createCategory(form) {
            try {
                await form.post('/admin/categories');
                this.$snackbar(`Категория ${form.name} успешно добавлена`);
                await this.$router.push({ name: 'categories.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании категории: ${e.message}`);
            }
        },
    },
};
</script>
