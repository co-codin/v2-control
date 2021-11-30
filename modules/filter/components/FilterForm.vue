<template>
    <v-form @submit.prevent="$emit('send', form)">
        <category-tree-search-field
            v-model="form.category_id"
            label="Категория"
            :error-messages="form.errors.get('categories')"
            :error="form.errors.has('categories')"
            name="category_id"
            :multiple="false"
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

export default {
    components: { CategoryTreeSearchField },
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
        this.form.type = this.filter.value;
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
