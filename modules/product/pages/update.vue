<template>
  <div>
    <page-header
      h1="Редактирование товара"
      :breadcrumbs="breadcrumbs"
    />
    <product-form
      v-if="product"
      :product="product"
      @send="updateProduct"
      is-updating
    />
    <seo-relation-form
      v-if="product"
      :seo="seo"
      @send="updateProductSeo"
      class="mt-3"
    />
  </div>
</template>


<script>
import ProductForm from "../components/ProductForm";
import SeoRelationForm from "~/components/forms/SeoRelationForm";
import Product from "../models/Product";
import PageHeader from "../../../components/common/PageHeader";

export default {
  head: {
    title: 'Редактирование товара',
  },
  components: {
    SeoRelationForm,
    ProductForm,
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
      .with('seo', 'categories')
      .$find(this.$route.params.id);

    product.status = product.status.value;
    product.categories = product.categories.map(category => ({
      id: category.id,
      is_main: Boolean(category.is_main),
    }))
    this.seo = product.seo || {};
    this.product = product;

    this.isLoading = false;
  },
  methods: {
    async updateProduct(form) {
      try {
        const { data } = await form.put(`/admin/products/${this.product.id}`);
        this.product.image = data.image;
        this.$snackbar(`Товар успешно обновлен`);
      }
      catch (e) {
        this.$snackbar('Произошла ошибка при обновлении товара: ' + e.message);
      }
    },
    async updateProductSeo (form) {
      try {
        await form.patch(`/admin/products/${this.product.id}/seo`);
        this.$snackbar(`SEO товара успешно обновлено`);
      }
      catch (e) {
        this.$snackbar('Произошла ошибка при обоновлении seo у товара: ' + e.message);
      }
    },
  }
}
</script>
