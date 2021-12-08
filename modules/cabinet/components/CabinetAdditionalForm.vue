<template>
    <v-form @submit.prevent="save">
        <v-text-field
            v-model="form.welcome_text"
            label="Приветственный текст"
            :error-messages="form.errors.get('welcome_text')"
            :error="form.errors.has('welcome_text')"
        />
    </v-form>
</template>

<script>
import Form from 'form-backend-validation';

export default {
    props: {
        cabinet: {
            type: Object | null,
            default: () => ({}),
        },
    },
    data: () => ({
        form: null,
        formDefaults: {
            welcome_text: null,
        },
    }),
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios, resetOnSuccess: false })
            .populate(this.cabinet || {});
    },
    methods: {
        async save() {},
    },
};
</script>
