<template>
  <v-card tile>
    <v-form @submit.prevent="$emit('send', form)">
      <v-card-title>
        Основная информация
      </v-card-title>
      <v-card-text>
        <slot name="fields">
          <categories-tree-field
            label="Категории"
            :value="categoryIds"
            @input="updateCategories"
            multiple
            :error-messages="form.errors.get('categories')"
            :error="form.errors.has('categories')"
          />

          <v-select
            v-if="categoryIds.length > 1"
            label="Основная категория"
            :value="mainCategoryId"
            :items="categories"
            item-value="id"
            :item-text="getCategoryText"
            @change="updateMainCategory"
          />

          <entity-autocomplete-field
            v-model="form.brand_id"
            @input="updateSlug"
            url="/brands"
            item-value="id"
            item-text="name"
            :query-params="{sort: 'name'}"
            :error-messages="form.errors.get('brand_id')"
            :error="form.errors.has('brand_id')"
            placeholder="Введите название производителя"
            label="Производитель"
            filter-column="id"
            search-column="name"
            hide-no-data
            cache-items
          />

          <v-text-field
            label="Модель"
            v-model="form.name"
            :error-messages="form.errors.get('name')"
            :error="form.errors.has('name')"
            @input="updateSlug"
          />

          <v-text-field
            label="Ссылка"
            v-model="form.slug"
            :error-messages="form.errors.get('slug')"
            :error="form.errors.has('slug')"
            append-icon="mdi-refresh"
            @click:append="form.slug = null; updateSlug()"
          />

          <file-field
            v-model="form.image"
            label="Главная фотография"
            @input="form.is_image_changed = true"
            :error-messages="form.errors.get('image')"
            :error="form.errors.has('image')"
          />

          <v-select
            v-model="form.status"
            label="Статус"
            :items="statusLabels"
            :error-messages="form.errors.get('status')"
            :error="form.errors.has('status')"
            item-text="text"
            item-value="value"
          />
        </slot>
      </v-card-text>
      <v-card-actions>
        <slot name="buttons">
          <v-btn
            type="submit"
            text
            color="blue-grey"
            class="white--text"
          >
            Сохранить
            <v-icon right dark>mdi-content-save</v-icon>
          </v-btn>
        </slot>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import Form from "form-backend-validation";
import Category from "~/modules/category/models/Category";
import CategoriesTreeField from "~/components/forms/CategoriesTreeField";
import EntityAutocompleteField from "~/components/forms/EntityAutocompleteField";
import { first, debounce } from "lodash";
import slugify from "slugify";
import Brand from "~/modules/brand/models/Brand";
import FileField from "~/components/forms/FileField";
import { Status, StatusDescription, enumToSelectArray } from "~/enums";
import Product from "../models/Product";

export default {
  props: {
    product: {
      type: Product,
    },
    isUpdating: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    form: null,
    formDefaults: {
      categories: [],
      brand_id: null,
      name: null,
      slug: null,
      image: null,
      is_image_changed: false,
      status: Status.Inactive,
      is_in_home: false,
      warranty: null,
      short_description: null,
      full_description: null,
    },
    categories: [],
    statusLabels: enumToSelectArray(StatusDescription),
  }),
  components: {
    CategoriesTreeField,
    EntityAutocompleteField,
    FileField,
  },
  methods: {
    async updateCategories(ids) {
      const mainCategoryId = this.mainCategoryId;
      this.form.categories = ids.map(id => ({
        id,
        is_main: ids.length === 1 || mainCategoryId === id,
      }));

      await this.updateSelectedCategories(ids);
      await this.updateSlug();
    },
    async updateSelectedCategories(ids) {
      if(!Boolean(ids.length)) {
        this.categories = [];
        return;
      }
      this.categories = await Category.query()
        .select({
          categories: ['id', 'name', 'product_name', 'slug', '_lft', '_rgt'],
          ancestors: ['id', 'name', '_lft', '_rgt']
        })
        .include('ancestors')
        .whereIn('id', ids)
        .orderBy('name')
        .$get();

      this.updateSlug();
    },
    updateMainCategory(value) {
      this.form.categories = this.form.categories.map(category => ({
        ...category,
        is_main: false,
      }));
      const category = this.form.categories.find(category => category.id === value);
      if(!category) return;
      category.is_main = true;

      this.updateSlug();
    },
    getCategoryText(category) {
      return `${category.name} (${category.ancestorsPath})`;
    },
    updateSlug: debounce(async function() {

      if(this.isUpdating && this.form.slug) {
        return;
      }

      const slugItems = [];

      if(this.categories.length === 1) {
        slugItems.push(first(this.categories).product_name);
      }
      else if(this.mainCategory) {
        slugItems.push(this.mainCategory.product_name);
      }

      if(this.form.brand_id) {
        const brand = await Brand.query()
          .select('slug')
          .where('id', this.form.brand_id)
          .$first();

        if(brand) {
          slugItems.push(brand.slug);
        }
      }

      if(this.form.name) {
        slugItems.push(this.form.name);
      }

      this.form.slug = slugItems.map(word => slugify(word, {lower: true})).join("-");
    }, 200)
  },
  created() {
    this.form = Form.create(this.formDefaults)
      .withOptions({ http: this.$axios, resetOnSuccess: false })
      .populate(this.product || {});

    if(this.isUpdating) {
      this.updateSelectedCategories(this.categoryIds);
    }
  },
  watch: {
    product: {
      handler(value) {
        this.form.populate(value);
      },
      deep: true,
    },
  },
  computed: {
    categoryIds() {
      return this.form.categories?.map(category => category.id);
    },
    mainCategory() {
      return this.categories.find(category => category.id === this.mainCategoryId);
    },
    mainCategoryId() {
      return this.form.categories.find(category => category.is_main === true)?.id;
    },
  },
}
</script>
