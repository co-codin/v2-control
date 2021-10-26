<template>
    <div>
        <page-header h1="Добавление категории" :breadcrumbs="breadcrumbs"></page-header>
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
import PageHeader from "~/components/common/PageHeader";

export default {
    components: {
        PageHeader,
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
