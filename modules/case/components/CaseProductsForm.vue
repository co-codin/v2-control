<template>
    <v-form @submit.prevent="save">
        <template v-if="form">
            <entity-autocomplete-field
                :value="selectedProductIds"
                @input="updateProducts"
                url="/products"
                item-value="id"
                :item-text="itemText"
                :query-params="{ sort: 'name', include: 'brand,category', 'fields[products]': 'id,brand_id,name' }"
                :error-messages="form.errors.get('products')"
                :error="form.errors.has('products')"
                placeholder="Введите название товара"
                label="Товар"
                filter-column="id"
                search-column="live"
                hide-no-data
                cache-items
                no-filter
                chips
                deletable-chips
                clearable
                multiple
                filled
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
import EntityAutocompleteField from "~/components/forms/EntityAutocompleteField";

export default {
    components: {
        EntityAutocompleteField
    },
    data: () => ({
        form: null,
        formDefaults: {
            products: []
        },
    }),
    computed: {
        ...mapGetters({
            caseModel: 'case/case',
        }),
        selectedProductIds() {
            return this.form.products?.map((product) => product.id) ?? [];
        }
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios, resetOnSuccess: false })
            .populate(this.caseModel || {});
    },
    methods: {
        ...mapMutations({
            closeAllPanels: 'helper/closeAllPanels',
        }),
        async updateProducts(ids) {
            this.form.products = ids.map((id) => ({
                id,
            }));
        },
        async save() {
            try {
                await this.form.patch(`/admin/case_models/${this.caseModel.id}`);
                this.$snackbar(`Товары успешно сохранены`);
                this.closeAllPanels();
            } catch (e) {
                this.$snackbar(`Произошла ошибка при сохранении: ${e.message}`);
            }
        },
        itemText(item) {
            return `${item.category.product_name} ${item.brand.name} ${item.name}`
        }
    },
};
</script>
