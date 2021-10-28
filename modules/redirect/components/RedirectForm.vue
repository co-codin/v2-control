<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-card>
            <v-card-title>Основная информация</v-card-title>
            <v-card-text>
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
            </v-card-text>
            <v-card-actions>
                <slot name="buttons">
                    <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
                </slot>
            </v-card-actions>
        </v-card>
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
