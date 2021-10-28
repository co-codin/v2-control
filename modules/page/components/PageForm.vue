<template>
    <v-expansion-panel>
        <v-expansion-panel-header class="title">Основная информация</v-expansion-panel-header>
        <v-expansion-panel-content>
            <v-form @submit.prevent="$emit('send', form)">
                <v-input
                    v-if="pages.length"
                    label="Родительская страницы"
                    :error-messages="form.errors.get('parent_id')"
                    :error="form.errors.has('parent_id')"
                    dense
                >
                    <treeselect
                        v-model="form.parent_id"
                        placeholder="Выберите родительскую страницу"
                        :options="pages"
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
                    v-model="form.slug"
                    label="Ссылка"
                    :error-messages="form.errors.get('slug')"
                    :error="form.errors.has('slug')"
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
import ContentEditor from '~/components/editors/ContentEditor';
import { statusLabels } from '~/enums';
import { toTree } from '~/helpers';

export default {
    components: {
        ContentEditor,
        Treeselect,
    },
    props: {
        page: {
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
            status: 1,
            full_description: null,
        },
        form: null,
        statusLabels,
        pages: [],
    }),
    watch: {
        page(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.page || {});
    },
    async mounted() {
        const { data } = await this.$axios.$get('/pages/all');
        this.pages = toTree(data);
    },
    methods: {
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
