<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-text-field
            v-model="form.name"
            label="Название"
            :error-messages="form.errors.get('name')"
            :error="form.errors.has('name')"
        />

        <v-text-field
            v-model="form.key"
            label="Ссылка"
            :error-messages="form.errors.get('key')"
            :error="form.errors.has('key')"
        />

        <v-input
            label="Описание"
            dense
            :error-messages="form.errors.get('description')"
            :error="form.errors.has('description')"
        >
            <content-editor v-model="form.description"> </content-editor>
        </v-input>

        <v-checkbox v-model="form.is_hidden_from_product" label="Скрыть со страницы товара" />
        <v-checkbox v-model="form.is_hidden_from_comparison" label="Скрыть из сравнения" />
        <v-checkbox v-model="form.is_numeric" label="Число" />
        <v-checkbox
            v-model="form.is_multiple"
            label="Многочисленно"
            :error-messages="form.errors.get('is_in_home')"
            :error="form.errors.has('is_in_home')"
        />
        <slot name="buttons">
            <v-btn type="submit">Сохранить</v-btn>
        </slot>
    </v-form>
</template>

<script>
import { Form } from 'form-backend-validation';
import ContentEditor from '~/components/editors/ContentEditor';

export default {
    components: {
        ContentEditor,
    },
    props: {
        property: {
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
            key: null,
            description: null,
            is_hidden_from_product: false,
            is_hidden_from_comparison: false,
            is_numeric: false,
            is_multiple: false,
        },
        form: null,
    }),
    watch: {
        property(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.property || {});
    },
};
</script>
