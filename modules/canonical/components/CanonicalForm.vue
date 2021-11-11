<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-text-field
            v-model="form.url"
            label="Страница"
            :error-messages="form.errors.get('url')"
            :error="form.errors.has('url')"
        />

        <v-text-field
            v-model="form.canonical"
            label="Каноническая ссылка"
            :error-messages="form.errors.get('canonical')"
            :error="form.errors.has('canonical')"
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

export default {
    props: {
        canonical: {
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
            url: null,
            canonical: null,
        },
        form: null,
    }),
    watch: {
        canonical(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.canonical || {});
    },
};
</script>
