<template>
    <v-form @submit.prevent="save">
        <v-expansion-panels v-if="form">
            <form-block title="Модификации">
                <product-variation-form />
            </form-block>
        </v-expansion-panels>
        <v-row class="expansion-panel-actions mt-3">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import ProductVariationForm from '~/modules/product/components/ProductVariationForm';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        ProductVariationForm,
    },
    created() {
        this.initForm();
        this.fillForm({
            variations: this.product?.productVariations || [],
        });
    },
    computed: {
        ...mapGetters({
            product: 'product/product',
            form: 'forms/configurator/form',
        }),
    },
    methods: {
        ...mapMutations({
            initForm: 'forms/configurator/INIT_FORM',
            fillForm: 'forms/configurator/FILL_FORM',
            fillErrors: 'forms/configurator/FILL_ERRORS',
        }),
        ...mapActions({
            createConfigurator: 'forms/configurator/createConfigurator',
        }),
        async save() {
            try {
                await this.createConfigurator(this.product.id);
                this.$snackbar(`Конфигуратор успешно обновлен`);
            } catch (e) {
                const errors = e?.response?.data?.errors;
                if (errors) {
                    this.fillErrors(errors);
                }
                this.$snackbar(`Произошла ошибка при обновлении товара: ${e.message}`);
            }
        },
    },
};
</script>
