<template>
    <v-form @submit.prevent="send"> </v-form>
</template>

<script>
import { Form } from 'form-backend-validation';

export default {
    props: {
        filter: {
            type: Object | null,
            default: () => ({}),
        },
    },
    data: () => ({
        formDefaults: {
            options: {
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
    methods: {},
};
</script>
