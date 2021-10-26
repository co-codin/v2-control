<template>
    <div>
        <page-header h1="Добавление товара" :breadcrumbs="breadcrumbs"/>
        <product-form @send="createProduct"/>
    </div>
</template>

<script>
import ProductForm from '../components/ProductForm';
import PageHeader from "~/components/common/PageHeader";

export default {
    components: {
        PageHeader,
        ProductForm,
    },
    data: () => ({
        breadcrumbs: [
            {text: 'Главная', href: '/'},
            {text: 'Товары', href: '/products'},
            {text: 'Добавление товара'},
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
                await this.$router.push({name: 'products.index'});
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании товара: ${e.message}`);
            }
        },
    },
};
</script>
