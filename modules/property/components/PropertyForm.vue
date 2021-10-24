<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-text-field
            v-model="form.name"
            label="Название"
            :error-messages="form.errors.get('name')"
            :error="form.errors.has('name')"
        ></v-text-field>

        <v-text-field
            v-model="form.key"
            label="Ссылка"
            :error-messages="form.errors.get('key')"
            :error="form.errors.has('key')"
        ></v-text-field>

        <v-input
            label="Описание"
            dense
            :error-messages="form.errors.get('description')"
            :error="form.errors.has('description')"
        >
            <content-editor v-model="form.description"> </content-editor>
        </v-input>

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
        brand: {
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
        brand(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.brand || {});
    },
};
</script>
