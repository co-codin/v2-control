<template>
  <div class="d-flex flex-column flex-grow-1">

    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Добавление товара</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>

    <v-card class="pa-2" v-if="form">

      <v-form @submit.prevent="createProduct(form)">

        <categories-tree-field
          label="Категории"
          :value="categoryIds"
          @input="updateCategories"
        />

        <v-select
          v-if="categories.length > 1"
          label="Основная категория"
          :value="mainCategoryId"
          :items="categories"
          item-value="id"
          item-text="name"
          @change="updateMainCategory"
        />

        <v-text-field
          label="Производитель"
          v-model="form.brand_id"
          :error-messages="form.errors.get('brand_id')"
          :error="form.errors.has('brand_id')"
        />

        <v-text-field
          label="Модель"
          v-model="form.name"
          :error-messages="form.errors.get('name')"
          :error="form.errors.has('name')"
        />

        <v-text-field
          label="Ссылка"
          v-model="form.slug"
          :error-messages="form.errors.get('slug')"
          :error="form.errors.has('slug')"
        />

        <v-btn type="submit">
          Добавить
        </v-btn>
      </v-form>

    </v-card>

  </div>
</template>


<script>
import Form from "form-backend-validation";
import Category from "../../category/models/Category";
import CategoriesTreeField from "../../../components/forms/CategoriesTreeField";

export default {
  head: {
    title: 'Добавление товара',
  },
  data: () => ({
    breadcrumbs: [
      { text: 'Главная', href: '/' },
      { text: 'Товары', href: '/products' },
      { text: 'Добавление товара' },
    ],
    form: null,
    formDefaults: {
      categories: [],
      brand_id: null,
      name: null,
      slug: null,
    },
    categories: [],
  }),
  components: {
    CategoriesTreeField,
  },
  methods: {
    async createProduct(form) {
      try {
        const brand_name = form.name;
        await form.post('/admin/products');
        this.$snackbar(`Производитель ${brand_name} успешно добавлен`)
        await this.$router.push({name: 'brands.index'});
      }
      catch (e) {
        this.$snackbar(`Произошла ошибка при создании производителя: ${e.message}`)
      }
    },
    updateCategories(ids) {
      const mainCategoryId = this.mainCategoryId;
      this.form.categories = ids.map(id => ({
        id,
        is_main: mainCategoryId === id,
      }));
    },
    updateMainCategory(value) {
      this.form.categories = this.form.categories.map(category => ({
        ...category,
        is_main: false,
      }));
      const category = this.form.categories.find(category => category.id === value);
      if(!category) return;
      category.is_main = true;
    },
  },
  watch: {
    async "form.categories"(value) {
      const ids = value.map(category => category.id);
      if(!Boolean(ids.length)) {
        this.categories = [];
        return;
      }
      this.categories = await Category.query()
        .select('id', 'name')
        .whereIn('id', ids)
        .$get();
    },
  },
  created() {
    this.form = Form.create(this.formDefaults)
      .withOptions({ http: this.$axios })
  },
  computed: {
    categoryIds() {
      return this.form.categories?.map(category => category.id);
    },
    mainCategoryId() {
      return this.form.categories.find(category => category.is_main === true)?.id;
    },
  },
}
</script>
