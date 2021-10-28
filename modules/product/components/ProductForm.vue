<template>
    <v-expansion-panel>
        <v-expansion-panel-header class="title">Основная информация</v-expansion-panel-header>
        <v-expansion-panel-content class="pb-0">
            <v-form @submit.prevent="$emit('send', form)">
                <categories-tree-field
                    label="Категории"
                    :value="categoryIds"
                    multiple
                    :error-messages="form.errors.get('categories')"
                    :error="form.errors.has('categories')"
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
                    @click:append="
                        form.slug = null;
                        updateSlug();
                    "
                />
                <file-field
                    v-model="form.image"
                    label="Главная фотография"
                    :error-messages="form.errors.get('image')"
                    :error="form.errors.has('image')"
                    prepend-icon="mdi-image"
                    @input="form.is_image_changed = true"
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
                <file-field
                    v-model="form.booklet"
                    :is-image="false"
                    label="Брошюра"
                    :error-messages="form.errors.get('booklet')"
                    :error="form.errors.has('booklet')"
                    @input="form.is_booklet_changed = true"
                />
                <v-text-field
                    v-model="form.video"
                    prepend-icon="mdi-youtube"
                    append-icon="mdi-open-in-new"
                    label="Видеообзор"
                    :error-messages="form.errors.get('video')"
                    :error="form.errors.has('video')"
                    @click:append="goToYoutube"
                />
                <v-textarea
                    v-model="form.short_description"
                    label="Короткое описание"
                    :error-messages="form.errors.get('short_description')"
                    :error="form.errors.has('short_description')"
                />
                <v-input
                    label="Подробное описание"
                    :error-messages="form.errors.get('full_description')"
                    :error="form.errors.has('full_description')"
                >
                    <content-editor v-model="form.full_description" />
                </v-input>
                <v-row class="expansion-panel-actions mt-5">
                    <v-col>
                        <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>

<script>
import Form from 'form-backend-validation';
import { first, debounce } from 'lodash';
import slugify from 'slugify';
import Category from '~/modules/category/models/Category';
import CategoriesTreeField from '~/components/forms/CategoriesTreeField';
import EntityAutocompleteField from '~/components/forms/EntityAutocompleteField';
import Brand from '~/modules/brand/models/Brand';
import FileField from '~/components/forms/FileField';
import { Status } from '~/enums';
import Product from '../models/Product';
import ContentEditor from '~/components/editors/ContentEditor';

export default {
    components: {
        CategoriesTreeField,
        EntityAutocompleteField,
        FileField,
        ContentEditor,
    },
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
            is_booklet_changed: false,
            status: Status.Inactive,
            is_in_home: false,
            warranty: null,
            short_description: null,
            full_description: null,
            booklet: null,
            video: null,
        },
        categories: [],
        statusLabels: [
            { value: 1, text: 'Отображается на сайте' },
            { value: 2, text: 'Скрыто' },
            { value: 3, text: 'Доступно только по URL' },
        ],
        isUpdatingSlug: false,
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
        goToYoutube() {
            window.open(this.form.video, '_blank');
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

            this.form.slug = slugItems.map((word) => slugify(word, { lower: true })).join('-');

            this.isUpdatingSlug = false;
        }, 200),
    },
};
</script>
