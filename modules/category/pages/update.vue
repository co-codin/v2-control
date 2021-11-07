<template>
    <div>
        <page-header h1="Редактирование категории" :breadcrumbs="breadcrumbs" />
        <template v-if="category && !$fetchState.pending">
            <v-expansion-panels v-if="category">
                <form-block title="Основная информация">
                    <category-form :category="category" is-updating @send="updateCategory" />
                </form-block>
                <form-block title="SEO">
                    <seo-relation-form :seo="seo" @send="updateCategorySeo" />
                </form-block>
                <form-block title="SEO данные товаров">
                    <seo-relation-form :seo="seo" @send="updateCategoryProductsSeo" />
                </form-block>
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
import CategoryForm from '../components/CategoryForm';
import SeoRelationForm from '@/components/forms/SeoRelationForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        PageHeader,
        SeoRelationForm,
        CategoryForm,
    },
    data: () => ({
        category: null,
        seo: null,
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
                await this.$router.push({ name: 'categories.index' });
            } catch (e) {
                this.$snackbar(`Прозиошла ошибка при обоновлении seo у категории: ${e.message}`);
            }
        },

        async updateCategoryProductsSeo(form) {
            try {
                await form.patch(`/admin/categories/${this.$route.params.id}/seo`);
                this.$snackbar(`SEO категории успешно обновлено`);
                await this.$router.push({ name: 'categories.index' });
            } catch (e) {
                this.$snackbar(`Прозиошла ошибка при обоновлении seo у категории: ${e.message}`);
            }
        },
    },
};
</script>
