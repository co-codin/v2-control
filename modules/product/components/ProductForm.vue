<template>
    <v-form @submit.prevent="$emit('send', form)">
        <category-tree-search-field
            label="Категории"
            :value="categoryIds"
            :error-messages="form.errors.get('categories')"
            :error="form.errors.has('categories')"
            name="categoryIds"
            @input="updateCategories"
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
            url="/brands"
            item-value="id"
            item-text="name"
            :query-params="{ sort: 'name' }"
            :error-messages="form.errors.get('brand_id')"
            :error="form.errors.has('brand_id')"
            placeholder="Введите название производителя"
            label="Производитель"
            filter-column="id"
            search-column="name"
            hide-no-data
            cache-items
            @input="updateSlug"
        />
        <v-text-field
            v-model="form.name"
            label="Модель"
            :error-messages="form.errors.get('name')"
            :error="form.errors.has('name')"
            @input="updateSlug"
        />
        <v-text-field
            v-model="form.slug"
            label="Ссылка"
            :error-messages="form.errors.get('slug')"
            :error="form.errors.has('slug')"
            append-icon="mdi-refresh"
            :loading="isUpdatingSlug"
            :rules="productRules"
            @click:append="
                form.slug = null;
                updateSlug();
            "
        />

        <v-select
            v-if="isUpdating"
            v-model="form.status"
            label="Статус"
            :items="statusLabels"
            :error-messages="form.errors.get('status')"
            :error="form.errors.has('status')"
            item-text="text"
            item-value="value"
        />
        <v-row class="expansion-panel-actions mt-5">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import Form from 'form-backend-validation';
import { first, debounce } from 'lodash';
import slugify from 'slugify';
import { mapGetters } from 'vuex';
import Category from '~/modules/category/models/Category';
import EntityAutocompleteField from '~/components/forms/EntityAutocompleteField';
import Brand from '~/modules/brand/models/Brand';
import { Status, statusLabels } from '~/enums';
import CategoryTreeSearchField from '~/components/search/fields/CategoryTreeSearchField';

export default {
    components: {
        CategoryTreeSearchField,
        EntityAutocompleteField,
    },
    props: {
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
            status: Status.Inactive,
            full_description: null,
            image: null,
        },
        categories: [],
        statusLabels,
        isUpdatingSlug: false,
        productRules: [
            (v) => {
                if (v && /^[a-zA-Z0-9\-\_]$/.test(v)) {
                    return true;
                }
                return false;
            },
        ],
    }),
    computed: {
        categoryIds() {
            return this.form.categories?.map((category) => category.id);
        },
        mainCategory() {
            return this.categories.find((category) => category.id === this.mainCategoryId);
        },
        mainCategoryId() {
            return this.form.categories.find((category) => category.is_main === true)?.id;
        },
        ...mapGetters({
            product: 'product/product',
        }),
    },
    watch: {
        product: {
            handler(value) {
                this.form.populate(value);
            },
            deep: true,
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios, resetOnSuccess: false })
            .populate(this.product || {});

        if (this.isUpdating) {
            this.updateSelectedCategories(this.categoryIds);
        }
    },
    methods: {
        async updateCategories(ids) {
            const { mainCategoryId } = this;
            this.form.categories = ids.map((id) => ({
                id,
                is_main: ids.length === 1 || mainCategoryId === id,
            }));

            await this.updateSelectedCategories(ids);
            await this.updateSlug();
        },
        async updateSelectedCategories(ids) {
            if (!ids.length) {
                this.categories = [];
                return;
            }
            this.categories = await Category.query()
                .select({
                    categories: ['id', 'name', 'product_name', 'slug', '_lft', '_rgt'],
                    ancestors: ['id', 'name', '_lft', '_rgt'],
                })
                .include('ancestors')
                .whereIn('id', ids)
                .orderBy('name')
                .$get();

            this.updateSlug();
        },
        updateMainCategory(value) {
            this.form.categories = this.form.categories.map((category) => ({
                ...category,
                is_main: false,
            }));
            const category = this.form.categories.find((category) => category.id === value);
            if (!category) return;
            category.is_main = true;

            this.updateSlug();
        },
        getCategoryText(category) {
            return `${category.name} (${category.ancestorsPath})`;
        },
        updateSlug: debounce(async function () {
            if (this.isUpdating && this.form.slug) {
                return;
            }

            this.isUpdatingSlug = true;

            const slugItems = [];

            if (this.categories.length === 1) {
                slugItems.push(first(this.categories).product_name);
            } else if (this.mainCategory) {
                slugItems.push(this.mainCategory.product_name);
            }

            if (this.form.brand_id) {
                const brand = await Brand.query().select('slug').where('id', this.form.brand_id).$first();

                if (brand) {
                    slugItems.push(brand.slug);
                }
            }

            if (this.form.name) {
                slugItems.push(this.form.name);
            }

            this.form.slug = slugItems
                .map((word) => slugify(word, { lower: true }))
                .join('-')
                .replace(/[^a-z0-9]/gi, '');

            this.isUpdatingSlug = false;
        }, 200),
        async save() {
            try {
                const { data } = await this.form.put(`/admin/products/${this.$route.params.id}`);
                this.$store.commit('product/SET_PRODUCT', data);
                this.$snackbar(`Товар успешно обновлен`);
            } catch (e) {
                this.$snackbar(`Произошла ошибка при обновлении товара: ${e.message}`);
            }
        },
    },
};
</script>
