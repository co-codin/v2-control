<template>
    <div>
        <page-header h1="Добавление производителя" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <form-block title="Основная информация">
                <brand-form @send="createBrand" />
            </form-block>
        </v-expansion-panels>
    </div>
</template>

<script>
import BrandForm from '../components/BrandForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        PageHeader,
        BrandForm,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Список производителей', to: { name: 'brands.index' } },
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
