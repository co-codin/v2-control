<template>
    <div>
        <template v-if="product && !$fetchState.pending">
            <page-header
                :h1="`Редактирование товара ${product.brand.name} ${product.name}`"
                :breadcrumbs="breadcrumbs"
            />
            <div class="mb-2">
                <v-btn
                    target="_blank"
                    link
                    :href="`${$config.app.siteUrl}/product/${product.slug}/${product.id}`"
                    color="info"
                >
                    <external-link-icon class="h-6 w-6 mr-1" /> Посмотреть на сайте
                </v-btn>
            </div>
            <v-expansion-panels>
                <form-block title="Основная информация">
                    <product-form is-updating @send="updateProduct" />
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
                    <seo-relation-form :seo="productSeo" @send="updateProductSeo" />
                </form-block>
                <form-block title="Уникальный контент">
                    <product-form-unique-content v-if="$auth.loggedIn" :product-id="product.id" />
                </form-block>
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ProductForm from '../components/ProductForm';
import ProductDocumentsForm from '~/modules/product/components/ProductDocumentsForm';
import ProductAdditionalForm from '~/modules/product/components/ProductAdditionalForm';
import SeoRelationForm from '~/components/forms/SeoRelationForm';
import PageHeader from '../../../components/common/PageHeader';
import ProductPropertiesForm from '~/modules/product/components/ProductPropertiesForm';
import ProductGalleryForm from '~/modules/product/components/ProductGalleryForm';
import FormBlock from '~/components/forms/FormBlock';
import ProductConfiguratorForm from '~/modules/product/components/ProductConfiguratorForm';
import ProductVariationForm from '~/modules/product/components/ProductVariationForm';
import ProductBenefitsForm from '~/modules/product/components/ProductBenefitsForm';
import ProductFormUniqueContent from '~/modules/product/components/ProductFormUniqueContent';
import ExternalLinkIcon from '~/components/heroicons/ExternalLinkIcon';

export default {
    components: {
        ExternalLinkIcon,
        ProductFormUniqueContent,
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
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список товаров', href: '/products' },
            { text: 'Редактирование товара' },
        ],
    }),
    async fetch() {
        await this.getProduct(this.$route.params.id);
    },
    head: {
        title: 'Редактирование товара',
    },
    computed: {
        ...mapGetters({
            product: 'product/product',
            productSeo: 'product/productSeo',
        }),
    },
    methods: {
        ...mapActions({
            getProduct: 'product/getProduct',
        }),
        async updateProduct(form) {
            try {
                await form.put(`/admin/products/${this.product.id}`);
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
