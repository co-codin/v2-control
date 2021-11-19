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
            label="Ключ"
            :error-messages="form.errors.get('key')"
            :error="form.errors.has('key')"
        />

        <v-text-field
            v-model="form.unit"
            label="Единица измерения"
            :error-messages="form.errors.get('unit')"
            :error="form.errors.has('unit')"
        />

        <wysiwyg-field
            label="Описание"
            :error-messages="form.errors.get('description')"
            :error="form.errors.has('description')"
            v-model="form.description"
        />

        <v-switch
            v-model="form.is_hidden_from_product"
            label="Скрыть со страницы товара"
            :error-messages="form.errors.get('is_hidden_from_product')"
            :error="form.errors.has('is_hidden_from_product')"
            inset
        />

        <v-switch
            v-model="form.is_hidden_from_comparison"
            label="Скрыть из сравнения"
            :error-messages="form.errors.get('is_hidden_from_comparison')"
            :error="form.errors.has('is_hidden_from_comparison')"
            inset
        />

        <v-switch
            v-model="form.is_numeric"
            label="Ввод только числовых значений"
            :error-messages="form.errors.get('is_numeric')"
            :error="form.errors.has('is_numeric')"
            inset
        />

        <v-switch
            v-model="form.is_boolean"
            label="Только Да или Нет"
            :error-messages="form.errors.get('is_boolean')"
            :error="form.errors.has('is_boolean')"
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
import WysiwygField from "~/components/forms/WysiwygField";

export default {
    components: {
        WysiwygField,
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
            unit: null,
            description: null,
            is_hidden_from_product: false,
            is_hidden_from_comparison: false,
            is_numeric: false,
            is_boolean: false,
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
