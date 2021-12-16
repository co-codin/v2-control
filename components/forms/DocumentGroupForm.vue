<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-text-field
            v-model="form.name"
            label="Название"
            :error-messages="form.errors.get('name')"
            :error="form.errors.has('name')"
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
    data: () => ({
        formDefaults: {
            name: null,
        },
        form: null,
    }),
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.property || {});
    },
};
</script>
