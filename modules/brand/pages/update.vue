<template>
    <div>
        <page-header h1="Редактирование производителя" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels v-if="brand">
            <brand-form :brand="brand" is-updating @send="updateBrand" />
            <seo-relation-form :seo="seo" @send="updateBrandSeo" />
        </v-expansion-panels>
    </div>
</template>

<script>
import BrandForm from '../components/BrandForm';
import SeoRelationForm from '@/components/forms/SeoRelationForm';
import PageHeader from "~/components/common/PageHeader";

export default {
    components: {
        PageHeader,
        SeoRelationForm,
        BrandForm,
    },
    data: () => ({
        brand: null,
        seo: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список производителей', href: '/brands' },
            { text: 'Редактирование производителя' },
        ],
    }),
    async fetch() {
        const { data } = await this.$axios.get(`/brands/${this.$route.params.id}`, {
            params: {
                include: ['seo'],
            },
        });
        data.data.status = data.data.status.value;
        this.seo = data.data.seo || {};
        this.brand = data.data;
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование производителя',
    },
    methods: {
        async updateBrand(form) {
            try {
                await form.put(`/admin/brands/${this.$route.params.id}`);
                this.$snackbar(`Производитель успешно обновлен`);
                await this.$router.push({ name: 'brands.index' });
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении производителя: ${e.message}`);
            }
        },
        async updateBrandSeo(form) {
            try {
                await form.patch(`/admin/brands/${this.$route.params.id}/seo`);
                this.$snackbar(`SEO производителя успешно обновлено`);
                await this.$router.push({ name: 'brands.index' });
            } catch (e) {
                this.$snackbar(`Прозиошла ошибка при обоновлении seo у производителя: ${e.message}`);
            }
        },
    },
};
</script>
