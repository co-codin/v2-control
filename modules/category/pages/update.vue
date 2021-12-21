<template>
    <div>
        <page-header h1="Редактирование категории" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels v-if="category && !$fetchState.pending">
            <form-block title="Основная информация">
                <category-form :category="category" is-updating @send="updateCategory" />
            </form-block>
            <form-block title="Критерии отзывов">
                <category-review-criteria-form :category="category" />
            </form-block>
            <form-block title="SEO">
                <seo-relation-form :seo="seo" @send="updateCategorySeo" />
            </form-block>
            <form-block title="SEO данные товаров">
                <seo-relation-form :seo="seoCategoryProducts" @send="updateCategoryProductsSeo" />
            </form-block>
        </v-expansion-panels>
    </div>
</template>

<script>
import CategoryForm from '../components/CategoryForm';
import SeoRelationForm from '@/components/forms/SeoRelationForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';
import CategoryReviewCriteriaForm from "~/modules/category/components/CategoryReviewCriteriaForm";
import Category from "~/modules/category/models/Category";
import login from "~/_pages/login";

export default {
    components: {
        FormBlock,
        PageHeader,
        SeoRelationForm,
        CategoryForm,
        CategoryReviewCriteriaForm,
    },
    data: () => ({
        category: null,
        seo: null,
        seoCategoryProducts: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Список категорий', to: { name: 'categories.index' } },
            { text: 'Редактирование категории' },
        ],
    }),
    async fetch() {
        this.category = await Category.include(['seo', 'seoCategoryProducts']).$find(this.$route.params.id);
        this.category.status = this.category.status.value;
        this.seo = this.category.seo || {};
        this.seoCategoryProducts = this.category.seo_category_products || {};
        console.log(this.category);
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
                await form.patch(`/admin/categories/${this.$route.params.id}/seo?type=2`);
                this.$snackbar(`SEO категории успешно обновлено`);
                await this.$router.push({ name: 'categories.index' });
            } catch (e) {
                this.$snackbar(`Прозиошла ошибка при обоновлении seo у категории: ${e.message}`);
            }
        },
    },
};
</script>
