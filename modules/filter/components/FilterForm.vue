<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-text-field
            v-model="form.name"
            label="Название"
            :error-messages="form.errors.get('name')"
            :error="form.errors.has('name')"
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
        />

        <v-select
            v-model="form.type"
            :items="typeLabels"
            label="Тип"
            :error-messages="form.errors.get('type')"
            :error="form.errors.has('type')"
        />

        <v-select
            v-if="properties.length"
            v-model="form.property_id"
            :items="properties"
            label="Характеристика"
            item-text="name"
            item-value="id"
            :error-messages="form.errors.get('property_id')"
            :error="form.errors.has('property_id')"
        />

        <v-textarea
            v-model="form.description"
            label="Описание"
            :error-messages="form.errors.get('description')"
            :error="form.errors.has('description')"
        />

        <field-value-autocomplete
            v-if="!isUpdating"
            v-model="form.facet.name"
            label="Системное поле"
            :error-messages="form.errors.get('facet.name')"
            :error="form.errors.has('facet.name')"
        />

        <v-text-field
            v-if="!isUpdating"
            v-model="form.facet.value"
            label="Значение для поиска"
            :error-messages="form.errors.get('facet.value')"
            :error="form.errors.has('facet.value')"
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
import { mapActions, mapGetters } from 'vuex';
import CategoryTreeSearchField from '~/components/search/fields/CategoryTreeSearchField';
import FieldValueAutocomplete from '~/components/forms/FieldValueAutocomplete';

export default {
    components: { FieldValueAutocomplete, CategoryTreeSearchField },
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
            type: null,
            category_id: null,
            property_id: null,
            description: null,
            facet: {
                name: null,
                value: null,
                path: null,
            },
        },
        typeLabels: [
            { value: 1, text: 'Список галочек' },
            { value: 2, text: 'Слайдер' },
            { value: 3, text: 'Галочка' },
        ],
        form: null,
    }),
    computed: {
        ...mapGetters({
            categories: 'category/categories',
            properties: 'property/properties',
        }),
        filteredProperties() {
            return this.properties;
        },
    },
    watch: {
        filter(value) {
            this.form.populate(value);
        },
    },
    async created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.filter || {});
        await this.getCategories();
        await this.getProperties();
    },
    methods: {
        ...mapActions({
            getCategories: 'category/getCategories',
            getProperties: 'property/getProperties',
        }),
    },
};
</script>
