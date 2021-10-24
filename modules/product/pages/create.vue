<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex align-center py-3">
            <div>
                <div class="display-1">Добавление товара</div>
                <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
            </div>
        </div>

        <product-form @send="createProduct" />
    </div>
</template>

<script>
import ProductForm from '../components/ProductForm';

export default {
    components: {
        ProductForm,
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
