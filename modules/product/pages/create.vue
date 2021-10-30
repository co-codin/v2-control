<template>
    <div>
        <page-header h1="Добавление товара" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <form-block title="Основная информация">
                <product-form @send="createProduct" />
            </form-block>
        </v-expansion-panels>
    </div>
</template>

<script>
import ProductForm from '../components/ProductForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from "~/components/forms/FormBlock";

export default {
    components: {
        PageHeader,
        ProductForm,
        FormBlock,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Главная', href: '/' },
            { text: 'Товары', href: '/products' },
            { text: 'Добавление товара' },
        ],
    }),
    head: {
        title: 'Добавление товара',
    },
    methods: {
        async createProduct(form) {
            try {
                await form.post('/admin/products');
                this.$snackbar(`Товар ${form.name} успешно добавлен`);
                await this.$router.push({ name: 'products.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании товара: ${e.message}`);
            }
        },
    },
};
</script>
