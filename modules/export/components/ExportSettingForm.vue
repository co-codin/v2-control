<template>
    <v-form @submit.prevent="$emit('send', form)">
        <v-expansion-panels v-if="form">
            <form-block title="Выбор категории">
                <category-tree-search-field
                    v-model="form.filter.category.ids"
                    label="Категории"
                    :error-messages="form.errors.get('filter.category.ids')"
                    :error="form.errors.has('filter.category.ids')"
                    name="categoryIds"
                />
                <v-switch
                    v-model="form.filter.category.selected"
                    label="Исключение"
                    :error-messages="form.errors.get('filter.category.selected')"
                    :error="form.errors.has('filter.category.selected')"
                    inset
                />
            </form-block>
        </v-expansion-panels>

        <v-expansion-panels v-if="form">
            <form-block title="Выбор бренда">
                <AutocompleteSearchField
                    v-model="form.filter.brand.ids"
                    :error-messages="form.errors.get('filter.brand.ids')"
                    :error="form.errors.has('filter.brand.ids')"
                    url="/brands"
                    name="filter.brand.ids"
                    label="Бренд"
                />
                <v-switch
                    v-model="form.filter.brand.selected"
                    label="Исключение"
                    :error-messages="form.errors.get('filter.brand.selected')"
                    :error="form.errors.has('filter.brand.selected')"
                    inset
                />
            </form-block>
        </v-expansion-panels>

        <v-expansion-panels v-if="form">
            <form-block title="Выбор товаров">
                <AutocompleteSearchField
                    v-model="form.filter.product.ids"
                    :error-messages="form.errors.get('filter.product.ids')"
                    :error="form.errors.has('filter.product.ids')"
                    url="/products"
                    name="filter.product.ids"
                    label="Товар"
                />
                <v-switch
                    v-model="form.filter.product.selected"
                    label="Исключение"
                    :error-messages="form.errors.get('filter.product.selected')"
                    :error="form.errors.has('filter.product.selected')"
                    inset
                />
            </form-block>
        </v-expansion-panels>
        <v-expansion-panels v-if="form">
            <form-block title="Настройки цены">
                <v-text-field
                    :value="form.min_price"
                    label="Минимальная цена"
                    type="number"
                    :error-messages="form.errors.get('min_price')"
                    :error="form.errors.has('min_price')"
                    dense
                />
                <v-text-field
                    :value="form.max_price"
                    label="Максимальная цена"
                    type="number"
                    :error-messages="form.errors.get('min_price')"
                    :error="form.errors.has('min_price')"
                    dense
                />
                <v-switch
                    v-model="form.has_price"
                    label="Наличие цены"
                    :error-messages="form.errors.get('has_price')"
                    :error="form.errors.has('has_price')"
                    inset
                />
                <v-switch
                    v-model="form.is_price_visible"
                    label="Видимость цены на сайте"
                    :error-messages="form.errors.get('is_price_visible')"
                    :error="form.errors.has('is_price_visible')"
                    inset
                />
            </form-block>
        </v-expansion-panels>

        <v-expansion-panels v-if="form">
            <form-block title="Другие настройки"> </form-block>
        </v-expansion-panels>

        <v-row class="expansion-panel-actions mt-5">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import { Form } from 'form-backend-validation';
import CategoryTreeSearchField from '~/components/search/fields/CategoryTreeSearchField';
import FormBlock from '~/components/forms/FormBlock';
import EntityAutocompleteField from '~/components/forms/EntityAutocompleteField';
import AutocompleteSearchField from '~/components/search/fields/AutocompleteSearchField';

export default {
    components: { AutocompleteSearchField, EntityAutocompleteField, FormBlock, CategoryTreeSearchField },
    props: {
        export: {
            type: Object | null,
            default: () => ({}),
        },
    },
    data: () => ({
        formDefaults: {
            filter: {
                category: {
                    ids: [],
                    selected: false,
                },
                brand: {
                    ids: [],
                    selected: false,
                },
                product: {
                    ids: [],
                    selected: false,
                },
                has_price: false,
                is_price_visible: false,
                max_price: 0,
                min_price: 0,
            },
        },
        form: null,
    }),
    watch: {
        export(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.export || {});
    },
};
</script>
