<template>
    <div>
        <page-header h1="Редактирование товара" :breadcrumbs="breadcrumbs"/>
        <template v-if="product">
            <v-expansion-panels>
                <form-block title="Основная информация">
                    <product-form is-updating @send="updateProduct"/>
                </form-block>
                <form-block title="Конфигуратор">
                    <product-configurator-form />
                </form-block>
                <form-block title="Галерея">
                    <product-gallery-form :product-name="productName" :images="images"/>
                </form-block>
                <form-block title="Характеристики">
                    <product-properties-form :properties="product.properties" @send="updateProperties"/>
                </form-block>
                <form-block title="SEO">
                    <seo-relation-form :seo="seo" @send="updateProductSeo"/>
                </form-block>
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
import FormBlock from "~/components/forms/FormBlock";
import ProductConfiguratorForm from "~/modules/product/components/ProductConfiguratorForm";
import ProductVariationForm from "~/modules/product/components/ProductVariationForm";

export default {
    components: {
        ProductVariationForm,
        ProductConfiguratorForm,
        ProductGalleryForm,
        SeoRelationForm,
        ProductForm,
        ProductPropertiesForm,
        PageHeader,
        FormBlock,
    },
    data: () => ({
        product: null,
        seo: null,
        isLoading: true,
        breadcrumbs: [
            {text: 'Главная', disabled: false, href: '/'},
            {text: 'Список товаров', href: '/products'},
            {text: 'Редактирование товара'},
        ],
    }),
    async fetch() {
        const product = await Product.query()
            .with('seo', 'categories', 'properties', 'brand', 'images', 'productVariations.currency')
            .$find(this.$route.params.id);

        product.status = product.status.value;
        product.categories = product.categories.map((category) => ({
            id: category.id,
            is_main: Boolean(category.is_main),
        }));

        this.$store.commit('forms/product/SET_PRODUCT', product);

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
                const {data} = await form.put(`/admin/products/${this.product.id}`);
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
