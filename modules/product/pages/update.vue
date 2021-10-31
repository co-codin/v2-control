<template>
    <div>
        <page-header h1="Редактирование товара" :breadcrumbs="breadcrumbs"/>
        <template v-if="product">
            <v-expansion-panels>
                <form-block title="Основная информация">
                    <product-form is-updating @send="updateProduct"/>
                </form-block>
                <form-block title="Дополнительная информация">
                    <product-additional-form />
                </form-block>
                <form-block title="Системные галереи">
                    <product-gallery-form />
                </form-block>
                <form-block title="Документы">
                    <product-documents-form />
                </form-block>
                <form-block title="Конфигуратор">
                    <product-configurator-form />
                </form-block>
                <form-block title="Характеристики">
                    <product-properties-form />
                </form-block>
                <form-block title="Особенности">
                    <product-benefits-form />
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
import ProductDocumentsForm from '~/modules/product/components/ProductDocumentsForm';
import ProductAdditionalForm from "~/modules/product/components/ProductAdditionalForm";
import SeoRelationForm from '~/components/forms/SeoRelationForm';
import Product from '../models/Product';
import PageHeader from '../../../components/common/PageHeader';
import ProductPropertiesForm from '~/modules/product/components/ProductPropertiesForm';
import ProductGalleryForm from '~/modules/product/components/ProductGalleryForm';
import FormBlock from "~/components/forms/FormBlock";
import ProductConfiguratorForm from "~/modules/product/components/ProductConfiguratorForm";
import ProductVariationForm from "~/modules/product/components/ProductVariationForm";
import {mapGetters} from "vuex";
import ProductBenefitsForm from "~/modules/product/components/ProductBenefitsForm";

export default {
    components: {
        PageHeader,
        FormBlock,
        ProductForm,
        ProductBenefitsForm,
        ProductDocumentsForm,
        ProductVariationForm,
        ProductAdditionalForm,
        ProductConfiguratorForm,
        ProductGalleryForm,
        ProductPropertiesForm,
        SeoRelationForm,
    },
    data: () => ({
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
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование товара',
    },
    computed: {
        ...mapGetters({
            product: 'forms/product/product',
        }),
    },
    methods: {
        async updateProduct(form) {
            try {
                const { data } = await form.put(`/admin/products/${this.product.id}`);
                // this.product.image = data.image;
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
    },
};
</script>
