<template>
    <v-form @submit.prevent="$emit('send', form)">

        <category-tree-search-field
            v-model="form.parent_id"
            label="Родительская категория"
            :error-messages="form.errors.get('parent_id')"
            :error="form.errors.has('parent_id')"
            :multiple="false"
            name="parent_id"
            @input="updateSlug"
        />

        <v-text-field
            v-model="form.name"
            @input="updateSlug"
            label="Название"
            :error-messages="form.errors.get('name')"
            :error="form.errors.has('name')"
        />

        <v-text-field
            v-model="form.slug"
            label="Ссылка"
            :loading="isUpdatingSlug"
            append-icon="mdi-refresh"
            :error-messages="form.errors.get('slug')"
            :error="form.errors.has('slug')"
            @click:append="
                form.slug = null;
                updateSlug();
            "
        />

        <v-text-field
            v-model="form.product_name"
            label="Имя продукта"
            :error-messages="form.errors.get('product_name')"
            :error="form.errors.has('product_name')"
        />

        <file-field
            v-model="form.image"
            label="Главная фотография"
            :error-messages="form.errors.get('image')"
            :error="form.errors.has('image')"
            @input="form.is_image_changed = true"
            @delete="form.image = null; form.is_image_changed = true"
        />

        <wysiwyg-field
            v-model="form.full_description"
            label="Подробное описание"
            :error-messages="form.errors.get('full_description')"
            :error="form.errors.has('full_description')"
        />

        <v-select
            v-model="form.status"
            label="Статус"
            :items="statusLabels"
            :error-messages="form.errors.get('status')"
            :error="form.errors.has('status')"
        />

        <v-switch
            v-model="form.is_in_home"
            label="Отображать на главной"
            :error-messages="form.errors.get('is_in_home')"
            :error="form.errors.has('is_in_home')"
            inset
        />

        <v-switch
            v-if="!isUpdating"
            v-model="form.attach_default_filters"
            label="Применить фильтры по умолчанию"
            :error-messages="form.errors.get('attach_default_filters')"
            :error="form.errors.has('attach_default_filters')"
            inset
        />

        <v-row class="expansion-panel-actions mt-5">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import { Form } from 'form-backend-validation';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { mapGetters, mapActions } from 'vuex';
import FileField from '../../../components/forms/FileField';
import { statusLabels } from '~/enums';
import WysiwygField from '~/components/forms/WysiwygField';
import CategoryTreeSearchField from '~/components/search/fields/CategoryTreeSearchField';
import {debounce, first} from "lodash";
import Brand from "~/modules/brand/models/Brand";
import slugify from "slugify";

export default {
    components: {
        CategoryTreeSearchField,
        FileField,
        WysiwygField,
    },
    props: {
        category: {
            type: Object | null,
            default: () => ({}),
        },
        isUpdating: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        formDefaults: {
            parent_id: null,
            name: null,
            slug: null,
            image: null,
            product_name: null,
            full_description: null,
            is_in_home: false,
            status: 2,
            is_image_changed: false,
            attach_default_filters: false,
        },
        form: null,
        statusLabels,
        isUpdatingSlug: false,
    }),
    computed: {
        ...mapGetters({
            categoryTree: 'category/categoryTree',
            categories: 'category/categories',
        }),
    },
    watch: {
        category(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios, resetOnSuccess: false })
            .populate(this.category || {});
    },
    methods: {
        updateSlug: debounce(async function () {
            if (this.isUpdating && this.form.slug) {
                return;
            }
            this.isUpdatingSlug = true;
            let slugItems = [];
            if (this.form.parent_id) {
                let categoryId = this.form.parent_id;
                do {
                    let category = this.categories.find((item) => item.id === categoryId);
                    slugItems.unshift(category?.name);
                    categoryId = category?.parent_id;
                }
                while(categoryId);
            }
            slugItems.push(this.form.name);
            slugItems = slugItems.filter(Boolean);
            if (slugItems.length) {
                this.form.slug = slugItems
                    .map((word) => slugify(word, { lower: true }))
                    .join('/')
                    .replace(/[^a-z\/0-9-]/gi, '');
            }
            this.isUpdatingSlug = false;
        }, 200),
    },
};
</script>
