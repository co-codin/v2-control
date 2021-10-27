<template>
    <div>
        <page-header h1="Редактирование товара" :breadcrumbs="breadcrumbs" />
        <template v-if="product">
            <v-expansion-panels>
                <product-form :product="product" is-updating @send="updateProduct" />
                <product-variation-form :variations="product.productVariations" />
                <product-gallery-form :product-name="productName" :images="images" />
                <product-properties-form :properties="product.properties" @send="updateProperties" />
                <seo-relation-form :seo="seo" @send="updateProductSeo" />
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
import ProductForm from '../components/ProductForm';
import SeoRelationForm from '~/components/forms/SeoRelationForm';
import Product from '../models/Product';
import PageHeader from '../../../components/common/PageHeader';
import ProductPropertiesForm from '~/modules/product/components/ProductPropertiesForm';
import ProductGalleryForm from '~/modules/product/components/ProductGalleryForm';
import ProductVariationForm from '~/modules/product/components/ProductVariationForm';

export default {
    components: {
        ProductVariationForm,
        ProductGalleryForm,
        SeoRelationForm,
        ProductForm,
        ProductPropertiesForm,
        PageHeader,
    },
    data: () => ({
        product: null,
        seo: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список товаров', href: '/products' },
            { text: 'Редактирование товара' },
        ],
    }),
    async fetch() {
        const product = await Product.query()
            .select({
                categories: ['id'],
            })
            .with('seo', 'categories', 'properties', 'brand', 'images', 'productVariations.currency')
            .$find(this.$route.params.id);

        product.status = product.status.value;
        product.categories = product.categories.map((category) => ({
            id: category.id,
            is_main: Boolean(category.is_main),
        }));
        this.seo = product.seo || {};
        this.product = product;

        this.isLoading = false;
    },
    head: {
        title: 'Редактирование товара',
    },
    computed: {
        productName() {
            return `${this.product.brand.name} ${this.product.name}`;
        },
        images() {
            return this.product.images.map((img) => {
                return {
                    position: img.position,
                    image: `${this.$config.app.storageUrl}/${img.image}`,
                };
            });
        },
    },
    methods: {
        async updateProduct(form) {
            try {
                const { data } = await form.put(`/admin/products/${this.product.id}`);
                this.product.image = data.image;
                this.$snackbar(`Товар успешно обновлен`);
            } catch (e) {
                this.$snackbar(`Произошла ошибка при обновлении товара: ${e.message}`);
            }
        },
        async updateProductSeo(form) {
            try {
                await form.patch(`/admin/products/${this.product.id}/seo`);
                this.$snackbar(`SEO товара успешно обновлено`);
            } catch (e) {
                this.$snackbar(`Произошла ошибка при обоновлении seo у товара: ${e.message}`);
            }
        },
        async updateProperties(form) {
            try {
                await form.put(`/admin/products/${this.product.id}/properties`);
                this.$snackbar(`Характеристики товара успешно обновлены`);
            } catch (e) {
                this.$snackbar(`Произошла ошибка при обоновлении характеристик у товара: ${e.message}`);
            }
        },
    },
};
</script>
