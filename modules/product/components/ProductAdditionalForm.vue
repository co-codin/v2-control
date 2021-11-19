<template>
    <v-form @submit.prevent="save">
        <template v-if="form">
            <field-value-autocomplete
                v-model="form.stock_type_id"
                label="Плашка"
                :error-messages="form.errors.get('stock_type_id')"
                :error="form.errors.has('stock_type_id')"
            />
            <v-switch
                v-model="form.has_test_drive"
                label="Доступен тест-драйв?"
                :error-messages="form.errors.get('has_test_drive')"
                :error="form.errors.has('has_test_drive')"
            />
            <v-switch
                v-model="form.is_in_home"
                label="Отображать на главной?"
                :error-messages="form.errors.get('is_in_home')"
                :error="form.errors.has('is_in_home')"
            />
            <v-text-field
                v-model="form.warranty"
                label="Гарантия"
                :error-messages="form.errors.get('warranty')"
                :error="form.errors.has('warranty')"
            />
            <v-textarea
                v-model="form.short_description"
                label="Короткое описание"
                :error-messages="form.errors.get('short_description')"
                :error="form.errors.has('short_description')"
            />
            <wysiwyg-field
                label="Подробное описание"
                :error-messages="form.errors.get('full_description')"
                :error="form.errors.has('full_description')"
                v-model="form.full_description"
            />
            <v-row class="expansion-panel-actions mt-5">
                <v-col>
                    <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
                </v-col>
            </v-row>
        </template>
    </v-form>
</template>

<script>
import { mapGetters } from 'vuex';
import Form from 'form-backend-validation';
import FieldValueAutocomplete from '~/components/forms/FieldValueAutocomplete';
import WysiwygField from "~/components/forms/WysiwygField";

export default {
    components: {
        FieldValueAutocomplete,
        WysiwygField,
    },
    data: () => ({
        form: null,
        formDefaults: {
            stock_type_id: null,
            has_test_drive: false,
            is_in_home: false,
            warranty: null,
            short_description: null,
            full_description: null,
        },
    }),
    computed: {
        ...mapGetters({
            product: 'product/product',
        }),
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios, resetOnSuccess: false })
            .populate(this.product || {});
    },
    methods: {
        async save() {
            try {
                await this.form.patch(`/admin/products/${this.product.id}`);
                this.$snackbar(`Дополнительная информация успешно сохранена`);
            } catch (e) {
                this.$snackbar(`Произошла ошибка при сохранении: ${e.message}`);
            }
        },
    },
};
</script>
