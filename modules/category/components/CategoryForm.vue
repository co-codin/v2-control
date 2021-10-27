<template>
    <v-expansion-panel>
        <v-expansion-panel-header class="title">Основная информация</v-expansion-panel-header>
        <v-expansion-panel-content>
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
                        :options="categoryTree"
                        :normalizer="normalizer"
                        @input="inputParent"
                    />
                </v-input>

                <v-text-field
                    v-model="form.name"
                    label="Название"
                    :error-messages="form.errors.get('name')"
                    :error="form.errors.has('name')"
                />

                <v-text-field
                    v-model="form.product_name"
                    label="Имя продукта"
                    :error-messages="form.errors.get('product_name')"
                    :error="form.errors.has('product_name')"
                />

                <v-text-field
                    v-model="form.slug"
                    label="Ссылка"
                    :error-messages="form.errors.get('slug')"
                    :error="form.errors.has('slug')"
                />

                <file-field
                    v-model="form.image"
                    label="Главная фотография"
                    :error-messages="form.errors.get('image')"
                    :error="form.errors.has('image')"
                    @input="form.is_image_changed = true"
                />

                <v-input
                    label="Подробное описание"
                    :error-messages="form.errors.get('full_description')"
                    :error="form.errors.has('full_description')"
                >
                    <content-editor v-model="form.full_description" />
                </v-input>

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
                />

                <v-switch
                    v-model="form.is_hidden_in_parents"
                    label="Скрыть товары из родительской категории"
                    :error-messages="form.errors.get('is_hidden_in_parents')"
                    :error="form.errors.has('is_hidden_in_parents')"
                />

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
import { Form } from 'form-backend-validation';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { mapGetters, mapActions } from 'vuex';
import FileField from '../../../components/forms/FileField';
import ContentEditor from '~/components/editors/ContentEditor';

export default {
    components: {
        Treeselect,
        FileField,
        ContentEditor,
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
            is_hidden_in_parents: false,
            status: null,
            is_image_changed: false,
        },
        statusLabels: [
            { value: 1, text: 'Отображается на сайте' },
            { value: 2, text: 'Скрыто' },
            { value: 3, text: 'Доступно только по URL' },
            { value: 4, text: 'Удалено' },
        ],
        form: null,
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
        form: {
            handler(form) {
                if (form.parent_id && !form.slug) {
                    const parents = [];
                    let parent = this.categories.filter((category) => category.id === form.parent_id)[0];
                    while (parent.id) {
                        parents.push(parent);
                        parent = this.categories.filter((category) => category.id === parent.parent_id);
                    }
                    form.slug = `${parents.map((parent) => parent.slug).join('/')}/`;
                }
            },
            deep: true,
        },
    },
    async mounted() {
        await this.getCategories();
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios, resetOnSuccess: false })
            .populate(this.category || {});
    },
    methods: {
        ...mapActions({
            getCategories: 'category/getCategories',
        }),
        normalizer: (item) => ({
            id: item.id,
            label: item.name || item.label,
            children: item.children && item.children.length > 0 ? item.children : undefined,
        }),
        inputParent(value) {
            if (value === undefined) this.form.parent_id = null;
        },
    },
};
</script>
