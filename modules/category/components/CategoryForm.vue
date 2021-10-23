<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-input
            label="Родительская категория"
            :error-messages="form.errors.get('parent_id')"
            :error="form.errors.has('parent_id')"
            dense
        >
            <treeselect
                v-model="form.parent_id"
                placeholder="Выберите родительскую категорию"
                :options="categories"
                :normalizer="normalizer"
                @input="inputParent"
            />
        </v-input>
        <slot name="buttons">
            <v-btn type="submit">Сохранить</v-btn>
        </slot>
    </v-form>
</template>

<script>
import { Form } from 'form-backend-validation';
import Treeselect from '@riophae/vue-treeselect';
import FileField from '../../../components/forms/FileField';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import Category from '~/modules/category/models/Category';

export default {
    components: {
        FileField,
        Treeselect,
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
            image: '',
            product_name: null,
            full_description: null,
            status: 1,
            seo: {
                is_enabled: 2,
            },
            seo_products: {
                is_enabled: 2,
            },
            is_in_home: 2,
            is_hidden_in_parents: 1,
            links: [],
            attach_default_filters: false,
        },
        statusLabels: [
            { value: 1, text: 'Active' },
            { value: 2, text: 'Inactive' },
            { value: 3, text: 'Only By Url' },
        ],
        form: null,
        categories: [],
    }),
    watch: {
        category(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.category || {});
        this.categories = Category().where('status', 1).get();
        console.log(this.categories);
    },
    methods: {},
};
</script>
