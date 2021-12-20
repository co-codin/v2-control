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
                inset
            />
            <v-switch
                v-model="form.is_in_home"
                label="Отображать на главной?"
                :error-messages="form.errors.get('is_in_home')"
                :error="form.errors.has('is_in_home')"
                inset
            />

            <v-switch
                v-model="form.is_arbitrary_warranty"
                label="Гарантия в произвольном формате"
                :error-messages="form.errors.get('is_arbitrary_warranty')"
                :error="form.errors.has('is_arbitrary_warranty')"
                inset
            />

            <wysiwyg-field
                v-if="form.is_arbitrary_warranty"
                v-model="form.arbitrary_warranty_info"
                label="Гарантия в произвольном формате"
                :error-messages="form.errors.get('arbitrary_warranty_info')"
                :error="form.errors.has('arbitrary_warranty_info')"
            />

            <v-text-field
                v-model="form.warranty"
                type="number"
                label="Гарантия"
                :error-messages="form.errors.get('warranty')"
                :error="form.errors.has('warranty')"
            />
            <wysiwyg-field
                v-model="form.warranty_info"
                label="Информация о гарантии"
                :error-messages="form.errors.get('warranty_info')"
                :error="form.errors.has('warranty_info')"
            />
            <v-textarea
                v-model="form.short_description"
                label="Короткое описание"
                :error-messages="form.errors.get('short_description')"
                :error="form.errors.has('short_description')"
            />
            <wysiwyg-field
                v-model="form.full_description"
                label="Подробное описание"
                :error-messages="form.errors.get('full_description')"
                :error="form.errors.has('full_description')"
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
import { mapGetters, mapMutations } from 'vuex';
import Form from 'form-backend-validation';
import FieldValueAutocomplete from '~/components/forms/FieldValueAutocomplete';
import WysiwygField from '~/components/forms/WysiwygField';

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
            warranty_info: null,
            is_arbitrary_warranty: false,
            arbitrary_warranty_info: null,
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
        ...mapMutations({
            closeAllPanels: 'helper/closeAllPanels',
        }),
        async save() {
            try {
                await this.form.patch(`/admin/products/${this.product.id}`);
                this.$snackbar(`Дополнительная информация успешно сохранена`);
                this.closeAllPanels();
            } catch (e) {
                this.$snackbar(`Произошла ошибка при сохранении: ${e.message}`);
            }
        },
    },
};
</script>
