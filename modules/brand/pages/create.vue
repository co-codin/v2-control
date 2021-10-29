<template>
    <div>
        <page-header h1="Добавление производителя" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <brand-form @send="createBrand" />
        </v-expansion-panels>
    </div>
</template>

<script>
import BrandForm from '../components/BrandForm';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        PageHeader,
        BrandForm,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список производителей', href: '/brands' },
            { text: 'Добавление производителя' },
        ],
    }),
    head: {
        title: 'Добавление производителя',
    },
    methods: {
        async createBrand(form) {
            try {
                await form.post('/admin/brands');
                this.$snackbar(`Производитель ${form.name} успешно добавлен`);
                await this.$router.push({ name: 'brands.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании производителя: ${e.message}`);
            }
        },
    },
};
</script>
