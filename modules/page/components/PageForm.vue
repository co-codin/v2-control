<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-input
            v-if="pages.length"
            hide-details
            :error-messages="form.errors.get('parent_id')"
            :error="form.errors.has('parent_id')"
            dense
        >
            <div class="input-custom">
                <template @slot="label"> Родительская страница </template>
                <treeselect
                    v-model="form.parent_id"
                    placeholder="Выберите родительскую страницу"
                    :options="pages"
                    :normalizer="normalizer"
                    @input="inputParent"
                />
            </div>
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

        <v-row class="expansion-panel-actions mt-5">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import { Form } from 'form-backend-validation';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { statusLabels } from '~/enums';
import { toTree } from '~/helpers';
import WysiwygField from '~/components/forms/WysiwygField';

export default {
    components: {
        WysiwygField,
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
            status: null,
            parent_id: null,
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

<style scoped>
.input-custom {
    flex-direction: column;
}
</style>
