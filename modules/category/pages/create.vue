<template>
    <div>
        <page-header h1="Добавление категории" :breadcrumbs="breadcrumbs"></page-header>
        <v-expansion-panels :value="0">
            <form-block title="Основная информация">
                <category-form @send="createCategory" />
            </form-block>
        </v-expansion-panels>
    </div>
</template>

<script>
import CategoryForm from '../components/CategoryForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        PageHeader,
        CategoryForm,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Список категорий', to: { name: 'categories.index' } },
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
