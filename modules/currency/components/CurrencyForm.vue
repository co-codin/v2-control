<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-text-field
            v-model="form.name"
            label="Название"
            :error-messages="form.errors.get('name')"
            :error="form.errors.has('name')"
        />

        <v-text-field
            v-model="form.iso_code"
            label="Сокращение"
            :error-messages="form.errors.get('iso_code')"
            :error="form.errors.has('iso_code')"
        />

        <v-text-field
            v-model="form.rate"
            type="number"
            label="Курс"
            :error-messages="form.errors.get('rate')"
            :error="form.errors.has('rate')"
        />

        <v-checkbox
            v-model="form.is_main"
            label="Главная валюта"
            :error-messages="form.errors.get('is_main')"
            :error="form.errors.has('is_main')"
        />

        <slot name="buttons">
            <v-btn type="submit">Сохранить</v-btn>
        </slot>
    </v-form>
</template>

<script>
import { Form } from 'form-backend-validation';

export default {
    props: {
        currency: {
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
            iso_code: null,
            rate: null,
            is_main: false,
        },
        form: null,
    }),
    watch: {
        currency(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.currency || {});
    },
};
</script>
