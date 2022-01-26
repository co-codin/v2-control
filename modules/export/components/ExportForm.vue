<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-text-field
            v-model="form.name"
            label="Комментарий"
            :error-messages="form.errors.get('name')"
            :error="form.errors.has('name')"
            @input="updateFilename"
        />

        <v-text-field
            v-model="form.filename"
            label="Название файла"
            append-icon="mdi-refresh"
            :error-messages="form.errors.get('filename')"
            :error="form.errors.has('filename')"
            @click:append="
                form.filename = null;
                updateFilename();
            "
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
import { debounce } from 'lodash';
import slugify from 'slugify';
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
    methods: {
        updateFilename: debounce(function () {
            if (this.isUpdating && this.form.filename) {
                return;
            }

            this.isUpdatingSlug = true;
            let filename = slugify(this.form.name, { lower: true }).replace(/[^a-z0-9-]/gi, '');
            filename = filename.replace(/[^a-z0-9-]/gi, '');

            this.form.filename = `${filename}-${Math.random().toString(36).slice(2)}`;

            this.isUpdatingSlug = false;
        }, 200),
    },
};
</script>
