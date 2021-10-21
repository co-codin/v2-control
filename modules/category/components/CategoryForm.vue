<template>
    <v-form @submit.prevent="$emit('send', form)">
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

        <v-text-field
            v-model="form.website"
            label="Сайт"
            :error-messages="form.errors.get('website')"
            :error="form.errors.has('website')"
        ></v-text-field>

        <v-textarea
            v-model="form.short_description"
            label="Краткое описание"
            :error-messages="form.errors.get('short_description')"
            :error="form.errors.has('short_description')"
        ></v-textarea>

        <v-textarea
            v-model="form.full_description"
            label="Подробное описание"
            :error-messages="form.errors.get('full_description')"
            :error="form.errors.has('full_description')"
        ></v-textarea>

        <v-checkbox
            v-model="form.is_in_home"
            label="Отображать на главной"
            :error-messages="form.errors.get('is_in_home')"
            :error="form.errors.has('is_in_home')"
        ></v-checkbox>

        <file-field
            v-model="form.image"
            :error-messages="form.errors.get('image')"
            :error="form.errors.has('image')"
            @input="form.is_image_changed = true"
        ></file-field>

        <v-text-field
            v-model="form.country"
            label="Страна"
            :error-messages="form.errors.get('country')"
            :error="form.errors.has('country')"
        ></v-text-field>

        <v-select
            v-model="form.status"
            label="Статус"
            :items="statusLabels"
            :error-messages="form.errors.get('status')"
            :error="form.errors.has('status')"
        ></v-select>

        <slot name="buttons">
            <v-btn type="submit">Сохранить</v-btn>
        </slot>
    </v-form>
</template>

<script>
import { Form } from 'form-backend-validation';
import FileField from '../../../components/forms/FileField';

export default {
    components: {
        FileField,
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
            name: null,
            slug: null,
            status: 1,
            image: null,
            is_image_changed: false,
            is_in_home: false,
            website: null,
            short_description: null,
            full_description: null,
            country: null,
        },
        statusLabels: [
            { value: 1, text: 'Active' },
            { value: 2, text: 'Inactive' },
            { value: 3, text: 'Only By Url' },
        ],
        form: null,
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
    },
};
</script>
