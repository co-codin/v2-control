<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex align-center py-3">
            <div>
                <div class="display-1">Редактирование категории</div>
                <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
            </div>
        </div>

        <v-card :loading="isLoading" class="mb-3">
            <v-card-title> Основная информация </v-card-title>
            <v-card-text v-if="category">
                <category-form :category="category" is-updating @send="updateCategory" />
            </v-card-text>
        </v-card>

        <v-card :loading="isLoading">
            <v-card-title> SEO </v-card-title>
            <v-card-text v-if="category">
                <seo-relation-form :seo="seo" @send="updateCategorySeo" />
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import CategoryForm from '../components/CategoryForm';
import SeoRelationForm from '@/components/forms/SeoRelationForm';

export default {
    components: {
        SeoRelationForm,
        CategoryForm,
    },
    data: () => ({
        category: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список категорий', href: '/categories' },
            { text: 'Редактирование категории' },
        ],
    }),
    async fetch() {
        const { data } = await this.$axios.get(`/categories/${this.$route.params.id}`, {
            params: {
                include: ['seo'],
            },
        });
        data.data.status = data.data.status.value;
        this.seo = data.data.seo || {};
        this.category = data.data;
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование категории',
    },
    methods: {
        async updateCategory(form) {
            try {
                await form.put(`/admin/categories/${this.$route.params.id}`);
                this.$snackbar(`Категория успешно обновлена`);
                await this.$router.push({ name: 'categories.index' });
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении категории: ${e.message}`);
            }
        },
        async updateCategorySeo(form) {
            try {
                await form.patch(`/admin/categories/${this.$route.params.id}/seo`);
                this.$snackbar(`SEO категории успешно обновлено`);
                await this.$router.push({ name: 'categories' });
            } catch (e) {
                this.$snackbar(`Прозиошла ошибка при обоновлении seo у категории: ${e.message}`);
            }
        },
    },
};
</script>
