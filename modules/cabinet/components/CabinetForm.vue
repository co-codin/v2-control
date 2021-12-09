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
            :error-messages="form.errors.get('category_id')"
            :error="form.errors.has('category_id')"
            :multiple="false"
            name="category_id"
        />

        <wysiwyg-field
            v-model="form.full_description"
            class="mt-2"
            label="Подробное описание"
            :error-messages="form.errors.get('full_description')"
            :error="form.errors.has('full_description')"
        />

        <file-field
            v-model="form.image"
            label="Фотография"
            :error-messages="form.errors.get('image')"
            :error="form.errors.has('image')"
            prepend-icon="mdi-image"
            @input="form.is_image_changed = true"
            @delete="form.image = null"
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
import CategoryTreeSearchField from '~/components/search/fields/CategoryTreeSearchField';
import WysiwygField from '~/components/forms/WysiwygField';
import FileField from '~/components/forms/FileField';
import { statusLabels } from '~/enums';

export default {
    components: { FileField, WysiwygField, CategoryTreeSearchField },
    props: {
        cabinet: {
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
            category_id: null,
            full_description: null,
            image: null,
            is_image_changed: false,
            status: 1,
        },
        form: null,
        statusLabels,
    }),
    watch: {
        attribute(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.cabinet || {});
    },
};
</script>
