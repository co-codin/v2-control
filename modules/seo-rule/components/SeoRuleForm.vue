<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-text-field
            v-model="form.name"
            label="Название"
            :error-messages="form.errors.get('name')"
            :error="form.errors.has('name')"
        />
        <v-text-field
            v-model="form.url"
            label="Ссылка"
            :error-messages="form.errors.get('url')"
            :error="form.errors.has('url')"
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
        seoRule: {
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
        },
        form: null,
    }),
    watch: {
        seoRule(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.seoRule || {});
    },
};
</script>
