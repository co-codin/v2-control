<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-text-field
            v-model="form.name"
            label="Название"
            :error-messages="form.errors.get('name')"
            :error="form.errors.has('name')"
            @input="updateSlug"
        />
        <v-text-field
            v-model="form.slug"
            label="Ссылка"
            :error-messages="form.errors.get('slug')"
            :error="form.errors.has('slug')"
        />
        <category-tree-search-field
            v-model="form.category_id"
            label="Категория"
            :error-messages="form.errors.get('categories')"
            :error="form.errors.has('categories')"
            name="category_id"
            :multiple="false"
            class="mb-1"
        />

        <v-switch
            v-model="form.is_enabled"
            label="Отображать на сайте"
            :error-messages="form.errors.get('is_enabled')"
            :error="form.errors.has('is_enabled')"
            inset
        />

        <v-switch
            v-model="form.is_default"
            label="По умолчанию"
            :error-messages="form.errors.get('is_default')"
            :error="form.errors.has('is_default')"
            inset
        />

        <template v-if="!isUpdating">
            <v-divider class="mt-3 mb-2" />
            <h3>Настройки фильтрации</h3>
            <v-select
                v-model="form.type"
                :items="typeLabels"
                label="Метод фильтрации"
                :error-messages="form.errors.get('type')"
                :error="form.errors.has('type')"
                @input="form.facet.name = null; form.facet.property_id = null; updateFacetPath()"
            />
            <v-select
                v-model="form.is_system"
                :items="isSystemTypeLabels"
                label="Тип"
                :error-messages="form.errors.get('is_system')"
                :error="form.errors.has('is_system')"
            />
            <entity-autocomplete-field
                v-if="!form.is_system"
                v-model="form.facet.property_id"
                url="/properties"
                item-value="id"
                item-text="name"
                :query-params="propertyQueryParams"
                :error-messages="form.errors.get('facet.property_id')"
                :error="form.errors.has('facet.property_id')"
                placeholder="Введите название характеристики"
                label="Характеристика"
                filter-column="id"
                search-column="live"
                hide-no-data
                cache-items
                clearable
                @input="form.facet.name = null; form.facet.path = null"
            />
            <v-select
                v-else
                v-model="form.facet.name"
                label="Системное поле"
                :items="systemFilters"
                item-text="name_ru"
                item-value="name"
                :error-messages="form.errors.get('facet.name')"
                :error="form.errors.has('facet.name')"
                @change="form.property_id = null; updateFacetPath()"
            />
            <field-value-autocomplete
                v-if="form.type === 3"
                v-model="form.facet.value"
                label="Значение для поиска"
                :error-messages="form.errors.get('facet.value')"
                :error="form.errors.has('facet.value')"
            />
        </template>

        <template v-else>
            <wysiwyg-field
                v-model="form.description"
                label="Описание"
                :error-messages="form.errors.get('description')"
                :error="form.errors.has('description')"
            />
        </template>

        <v-row class="expansion-panel-actions mt-5">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import { Form } from 'form-backend-validation';
import { mapActions, mapGetters } from 'vuex';
import CategoryTreeSearchField from '~/components/search/fields/CategoryTreeSearchField';
import { systemFilters } from '~/enums';
import slugify from "slugify";
import EntityAutocompleteField from "~/components/forms/EntityAutocompleteField";
import FieldValueAutocomplete from "~/components/forms/FieldValueAutocomplete";
import WysiwygField from "~/components/forms/WysiwygField";

export default {
    components: {
        CategoryTreeSearchField, EntityAutocompleteField, FieldValueAutocomplete, WysiwygField,
    },
    props: {
        filter: {
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
            name: null,
            slug: null,
            is_system: false,
            type: null,
            category_id: null,
            description: null,
            is_default: false,
            is_enabled: false,
            unit: null,
            facet: {
                name: null,
                property_id: null,
                value: null,
                path: null,
            },
        },
        typeLabels: [
            { value: 1, text: 'Список галочек' },
            { value: 2, text: 'Слайдер' },
            { value: 3, text: 'Галочка' },
        ],
        isSystemTypeLabels: [
            { value: true, text: 'Системный' },
            { value: false, text: 'Пользовательский' },
        ],
        form: null,
    }),
    computed: {
        ...mapGetters({
            categories: 'category/categories',
        }),
        systemFilter() {
            if (!this.form.facet.name) {
                return null;
            }
            return systemFilters.find((filter) => filter.name === this.form.facet.name);
        },
        propertyQueryParams() {
            let params = {sort: 'name'};
            if(this.form.type === 2) {
                params['filter[is_numeric]'] = 1;
            }
            if(this.form.type === 1) {
                params['filter[is_boolean]'] = false;
            }
            return params;
        },
        systemFilters() {
            return systemFilters.sort((a, b) => a.name_ru.localeCompare(b.name_ru))
                .filter(a => this.form.type !== 2 || !! a?.is_numeric);
        },
    },
    watch: {
        filter(value) {
            this.form.populate(value);
        },
    },
    async created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios, resetOnSuccess: false })
            .populate(this.filter || {});
        await this.getCategories();
    },
    methods: {
        ...mapActions({
            getCategories: 'category/getCategories',
            getProperties: 'property/getProperties',
        }),
        updateSlug() {
            if (this.isUpdating && this.form.slug) {
                return;
            }
            this.form.slug = slugify(this.form.name, { lower: true, replacement: '_' })
                .replace(/[^a-z\/0-9_]/gi, '');
        },
        updateFacetPath() {
            this.form.facet.path = this.systemFilter?.path ?? null;
        },
    },
};
</script>
