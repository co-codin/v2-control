<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-text-field
            v-model="form.value"
            label="Значение"
            :error-messages="form.errors.get('value')"
            :error="form.errors.has('value')"
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
        fieldValue: {
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
            value: null,
        },
        form: null,
    }),
    watch: {
        fieldValue(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.fieldValue || {});
    },
};
</script>
