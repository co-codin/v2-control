<template>
    <field-value-autocomplete
        v-model="form.facet.name"
        label="Системное поле"
        :error-messages="form.errors.get('facet.name')"
        :error="form.errors.has('facet.name')"
    />

    <v-text-field
        v-model="form.facet.path"
        label="Путь"
        :error-messages="form.errors.get('facet.path')"
        :error="form.errors.has('facet.path')"
    />

    <v-text-field
        v-model="form.facet.value"
        label="Значение для поиска"
        :error-messages="form.errors.get('facet.value')"
        :error="form.errors.has('facet.value')"
    />
</template>

<script>
import { Form } from 'form-backend-validation';
import FieldValueAutocomplete from '~/components/forms/FieldValueAutocomplete';

export default {
    components: { FieldValueAutocomplete },
    props: {
        filter: {
            type: Object | null,
            default: () => ({}),
        },
    },
    data: () => ({
        formDefaults: {
            facet: {
                name: null,
                path: null,
                value: null,
            },
        },
        form: null,
    }),
    watch: {
        filter(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.filter || {});
    },
    methods: {
        async save() {},
    },
};
</script>
