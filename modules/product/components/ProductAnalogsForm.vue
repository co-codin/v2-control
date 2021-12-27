<template>
    <v-form @submit.prevent="save">
        <template v-if="form">
            <v-checkbox
                v-model="form.is_manually_analogs"
                label="Отключить автоматический подбор аналогов"
                :error-messages="form.errors.get(`is_manually_analogs`)"
                :error="form.errors.has(`is_manually_analogs`)"
                @end="updatePositions"
            />
            <v-expansion-panels :disabled="!form.is_manually_analogs">
                <draggable v-model="form.analogs" class="width-full">
                    <v-expansion-panel v-for="(analog, index) in form.analogs" :key="index">
                        <v-expansion-panel-header class="title text-left">
                            {{ getProductName(analog.analog_id) }}
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <entity-autocomplete-field
                                v-model="analog.analog_id"
                                @input="updateProducts"
                                url="/products"
                                item-value="id"
                                item-text="name"
                                :query-params="{ sort: 'name' }"
                                :error-messages="form.errors.get(`analogs.*.${index}.analog_id`)"
                                :error="form.errors.has(`analogs.*.${index}.analog_id`)"
                                placeholder="Введите название товара"
                                label="Товар"
                                filter-column="id"
                                search-column="live"
                                hide-no-data
                                cache-items
                                clearable
                            />
                            <div class="text-center mt-1">
                                <v-btn small class="white--text" color="red" @click="removeAnalog(index)">
                                    Удалить аналог
                                </v-btn>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </draggable>
            </v-expansion-panels>
            <div class="mt-2">
                <v-btn
                    :disabled="!form.is_manually_analogs"
                    small
                    color="primary"
                    outlined
                    @click="addAnalog"
                >
                    Добавить аналог
                </v-btn>
            </div>
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
import draggable from "vuedraggable";
import EntityAutocompleteField from "~/components/forms/EntityAutocompleteField";
import Product from "~/modules/product/models/Product";

export default {
    components: {
        draggable,
        EntityAutocompleteField,
    },
    data: () => ({
        form: null,
        formDefaults: {
            is_manually_analogs: false,
            analogs: [],
        },
        products: [],
    }),
    computed: {
        ...mapGetters({
            product: 'product/product',
        }),
    },
    created() {
        const analogs = this.product.analogs.map(analog => ({
            analog_id: analog.id,
            position: analog.pivot.position,
        }));

        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios, resetOnSuccess: false })
            .populate(this.product || {})
            .populate({ analogs })

        this.updatePositions();
        this.updateProducts();
    },
    methods: {
        ...mapMutations({
            closeAllPanels: 'helper/closeAllPanels',
        }),
        async save() {
            try {
                await this.form.patch(`/admin/products/${this.product.id}/analogs`);
                this.$snackbar(`Аналоги успешно обновлены`);
                this.closeAllPanels();
            } catch (e) {
                this.$snackbar(`Произошла ошибка при сохранении: ${e.message}`);
            }
        },
        removeAnalog(index) {
            this.form.analogs.splice(index, 1);
        },
        addAnalog() {
            this.form.analogs.push({
                analog_id: null,
                position: null,
            });
            this.updatePositions();
        },
        updatePositions() {
            let i = 0;
            this.form.analogs.forEach(item => item.position = ++i);
        },
        async updateProducts() {
            if(!this.form.analogs || !this.form.analogs.length) {
                return;
            }
            this.products = await Product.query()
                .select({
                    products: ['id', 'name', 'brand_id'],
                    brand: ['id', 'name'],
                })
                .with('brand')
                .whereIn('id', this.form.analogs.map(analog => analog.analog_id))
                .$get();
        },
        getProductName(id) {
            const product = this.products.find(product => product.id === id);
            return product ? `${product?.brand?.name} ${product?.name}` : '(не заполнено)';
        },
    },
};
</script>
