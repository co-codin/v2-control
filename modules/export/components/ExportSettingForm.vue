<template>
    <div>
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
                    <v-row class="expansion-panel-actions mt-5">
                        <v-col>
                            <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
                        </v-col>
                    </v-row>
                </form-block>
            </v-expansion-panels>
        </v-form>
        <v-form @submit.prevent="$emit('send', form)">
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
                    <v-row class="expansion-panel-actions mt-5">
                        <v-col>
                            <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
                        </v-col>
                    </v-row>
                </form-block>
            </v-expansion-panels>
        </v-form>
        <v-form @submit.prevent="$emit('send', form)">
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
                    <v-row class="expansion-panel-actions mt-5">
                        <v-col>
                            <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
                        </v-col>
                    </v-row>
                </form-block>
            </v-expansion-panels>
        </v-form>
        <v-form @submit.prevent="$emit('send', form)">
            <v-expansion-panels v-if="form">
                <form-block title="Настройки цены">
                    <v-text-field
                        v-model="form.filter.min_price"
                        label="Минимальная цена"
                        type="number"
                        :error-messages="form.errors.get('filter.min_price')"
                        :error="form.errors.has('filter.min_price')"
                        dense
                    />
                    <v-text-field
                        v-model="form.filter.max_price"
                        label="Максимальная цена"
                        type="number"
                        :error-messages="form.errors.get('filter.min_price')"
                        :error="form.errors.has('filter.min_price')"
                        dense
                    />
                    <v-switch
                        v-model="form.filter.has_price"
                        label="Наличие цены"
                        :error-messages="form.errors.get('filter.has_price')"
                        :error="form.errors.has('filter.has_price')"
                        inset
                    />
                    <v-switch
                        v-model="form.filter.is_price_visible"
                        label="Видимость цены на сайте"
                        :error-messages="form.errors.get('filter.is_price_visible')"
                        :error="form.errors.has('filter.is_price_visible')"
                        inset
                    />
                    <v-row class="expansion-panel-actions mt-5">
                        <v-col>
                            <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
                        </v-col>
                    </v-row>
                </form-block>
            </v-expansion-panels>
        </v-form>
        <v-form @submit.prevent="$emit('send', form)">
            <v-expansion-panels v-if="form">
                <form-block title="Другие настройки">
                    <field-value-autocomplete
                        v-model="form.filter.stock_type.ids"
                        :multiple="true"
                        label="Тип предложения"
                        :error-messages="form.errors.get('filter.stock_type.ids')"
                        :error="form.errors.has('filter.stock_type.ids')"
                    />
                    <v-switch
                        v-model="form.filter.has_short_description"
                        label="Наличие краткого описания"
                        :error-messages="form.errors.get('filter.has_short_description')"
                        :error="form.errors.has('filter.has_short_description')"
                        inset
                    />
                    <v-select
                        v-model="form.filter.availability.ids"
                        multiple
                        label="Наличие на складе"
                        :items="availabilityLabels"
                        :error-messages="form.errors.get('filter.availability.ids')"
                        :error="form.errors.has('filter.availability.ids')"
                        dense
                    />
                    <v-row class="expansion-panel-actions mt-5">
                        <v-col>
                            <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
                        </v-col>
                    </v-row>
                </form-block>
            </v-expansion-panels>
        </v-form>
    </div>
</template>

<script>
import { Form } from 'form-backend-validation';
import CategoryTreeSearchField from '~/components/search/fields/CategoryTreeSearchField';
import FormBlock from '~/components/forms/FormBlock';
import EntityAutocompleteField from '~/components/forms/EntityAutocompleteField';
import AutocompleteSearchField from '~/components/search/fields/AutocompleteSearchField';
import FieldValueAutocomplete from '~/components/forms/FieldValueAutocomplete';

export default {
    components: {
        FieldValueAutocomplete,
        AutocompleteSearchField,
        EntityAutocompleteField,
        FormBlock,
        CategoryTreeSearchField,
    },
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
                stock_type: {
                    ids: [],
                    selected: false,
                },
                availability: {
                    ids: [],
                    selected: false,
                },
                has_price: false,
                is_price_visible: false,
                max_price: 0,
                min_price: 0,
                has_short_description: false,
            },
        },
        form: null,
        availabilityLabels: [
            { value: 1, text: 'В наличии' },
            { value: 2, text: 'Под заказ' },
            { value: 3, text: 'Ожидается поступление' },
            { value: 4, text: 'Вышел из производства' },
            { value: 5, text: 'Отсутствует РУ' },
        ],
    }),
    created() {
        const data = Object.assign(this.formDefaults.filter, this.export.filter);

        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios, resetOnSuccess: false })
            .populate(data || {});
    },
};
</script>
