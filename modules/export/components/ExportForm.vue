<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-text-field
            v-model="form.name"
            label="Название"
            :error-messages="form.errors.get('name')"
            :error="form.errors.has('name')"
        />

        <v-text-field
            v-model="form.filename"
            label="Название файла"
            :error-messages="form.errors.get('filename')"
            :error="form.errors.has('filename')"
        />
        <v-select
            v-model="form.type"
            label="Тип"
            :items="exportTypeLabels"
            :error-messages="form.errors.get('type')"
            :error="form.errors.has('type')"
        />

        <v-select
            v-model="form.frequency"
            label="Частота"
            :items="frequencyLabels"
            :error-messages="form.errors.get('frequency')"
            :error="form.errors.has('frequency')"
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
import { exportTypeLabels, frequencyLabels } from '~/enums';

export default {
    props: {
        export: {
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
            filename: null,
            type: null,
            frequency: null,
        },
        form: null,
        exportTypeLabels,
        frequencyLabels,
    }),
    watch: {
        export(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.export || {});
    },
};
</script>
