<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-text-field
            v-model="form.name"
            label="Название"
            :error-messages="form.errors.get('name')"
            :error="form.errors.has('name')"
        ></v-text-field>

        <v-text-field
            v-model="form.url"
            label="Ссылка"
            :error-messages="form.errors.get('url')"
            :error="form.errors.has('url')"
        ></v-text-field>

        <v-text-field
            v-model="form.source"
            label="Источник"
            :error-messages="form.errors.get('source')"
            :error="form.errors.has('source')"
        ></v-text-field>

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
        publication: {
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
            url: null,
            source: null,
            is_enabled: false,
        },
        form: null,
    }),
    watch: {
        publication(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.publication || {});
    },
};
</script>
