<template>
    <v-form @submit.prevent="$emit('send', form)">
        <categories-tree-field
            label="Категория"
            :value="form.category_id"
            :error-messages="form.errors.get('category_id')"
            :error="form.errors.has('category_id')"
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
        ></v-select>

        <v-text-field
            v-model="form.name"
            label="Название"
            :error-messages="form.errors.get('name')"
            :error="form.errors.has('name')"
        ></v-text-field>

        <v-text-field
            v-model="form.slug"
            label="Ссылка"
            :error-messages="form.errors.get('slug')"
            :error="form.errors.has('slug')"
        ></v-text-field>

        <v-select
            v-model="form.type"
            :items="typeLabels"
            label="Тип"
            :error-messages="form.errors.get('type')"
            :error="form.errors.has('type')"
        ></v-select>

        <v-textarea
            v-model="form.description"
            label="Описание"
            :error-messages="form.errors.get('description')"
            :error="form.errors.has('description')"
        ></v-textarea>

        <v-switch
            v-model="form.is_default"
            label="По умолчанию"
            :error-messages="form.errors.get('is_default')"
            :error="form.errors.has('is_default')"
            inset
        />

        <v-switch
            v-model="form.is_enabled"
            label="Подключено"
            :error-messages="form.errors.get('is_enabled')"
            :error="form.errors.has('is_enabled')"
            inset
        />

        <slot name="buttons">
            <v-btn type="submit">Сохранить</v-btn>
        </slot>
    </v-form>
</template>

<script>
import { Form } from 'form-backend-validation';
import { mapActions, mapGetters } from 'vuex';
import CategoriesTreeField from '~/components/forms/CategoriesTreeField';

export default {
    components: { CategoriesTreeField },
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
            is_default: false,
            is_enabled: false,
            description: null,
        },
        typeLabels: [
            { value: 1, text: 'Хранилище' },
            { value: 2, text: 'Шаг' },
            { value: 3, text: 'Значение для поиска' },
        ],
        form: null,
    }),
    computed: {
        ...mapGetters({
            categories: 'category/categories',
            properties: 'property/properties',
        }),
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
