<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-text-field
            v-model="form.source"
            label="Откуда"
            :error-messages="form.errors.get('source')"
            :error="form.errors.has('source')"
        />
        <v-text-field
            v-model="form.destination"
            label="Куда"
            :error-messages="form.errors.get('destination')"
            :error="form.errors.has('destination')"
        />
        <v-select
            v-model="form.code"
            label="Код редиректа"
            :items="$enum('RedirectCode', true)"
            :error-messages="form.errors.get('code')"
            :error="form.errors.has('code')"
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
        redirect: {
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
            source: null,
            destination: null,
            code: 301
        },
        form: null,
    }),
    watch: {
        redirect(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.redirect || {});
    },
};
</script>
