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

        <v-checkbox
            v-model="form.is_default"
            label="По умолчанию"
            :error-messages="form.errors.get('is_default')"
            :error="form.errors.has('is_default')"
        ></v-checkbox>

        <v-checkbox
            v-model="form.is_enabled"
            label="Подключено"
            :error-messages="form.errors.get('is_enabled')"
            :error="form.errors.has('is_enabled')"
        ></v-checkbox>

        <slot name="buttons">
            <v-btn type="submit">Сохранить</v-btn>
        </slot>
    </v-form>
</template>

<script>
import { Form } from 'form-backend-validation';

export default {
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
            is_image_changed: false,
            is_default: false,
            is_enabled: null,
            description: null,
        },
        typeLabels: [
            { value: 1, text: 'Список галочек' },
            { value: 2, text: 'Слайдер' },
            { value: 3, text: 'Галочка' },
        ],
        form: null,
    }),
    watch: {
        filter(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.filter || {});
    },
};
</script>
