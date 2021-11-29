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

        <v-text-field
            v-model="form.source"
            label="Источник"
            :error-messages="form.errors.get('source')"
            :error="form.errors.has('source')"
        />

        <date-picker-field
            v-model="form.published_at"
            label="Дата публикации"
            :error-messages="form.errors.get('published_at')"
            :error="form.errors.has('published_at')"
        />

        <v-switch
            v-model="form.is_enabled"
            label="Отображается на сайте"
            :error-messages="form.errors.get('is_enabled')"
            :error="form.errors.has('is_enabled')"
            inset
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
import DatePickerField from "~/components/forms/DatePickerField";

export default {
    components: {
        DatePickerField,
    },
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
            published_at: null,
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
