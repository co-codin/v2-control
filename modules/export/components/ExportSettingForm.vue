<template>
    <div>
        <v-form @submit.prevent="$emit('send', form)">
            <v-expansion-panels v-if="form">
                <form-block title="Выбор категории">
                    <v-radio-group v-model="form.filter.category.selected">
                        <v-radio :value="true" label="Только выбранные" />
                        <v-radio :value="false" label="Исключить выбранные" />
                    </v-radio-group>

                    <category-tree-search-field
                        v-model="form.filter.category.ids"
                        label="Категории"
                        :error-messages="form.errors.get('filter.category.ids')"
                        :error="form.errors.has('filter.category.ids')"
                        name="categoryIds"
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
                    <v-radio-group v-model="form.filter.brand.selected">
                        <v-radio :value="true" label="Только выбранные" />
                        <v-radio :value="false" label="Исключить выбранные" />
                    </v-radio-group>

                    <AutocompleteSearchField
                        v-model="form.filter.brand.ids"
                        :error-messages="form.errors.get('filter.brand.ids')"
                        :error="form.errors.has('filter.brand.ids')"
                        url="/brands"
                        name="filter.brand.ids"
                        label="Бренд"
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
                    <v-radio-group v-model="form.filter.product.selected">
                        <v-radio :value="true" label="Только выбранные" />
                        <v-radio :value="false" label="Исключить выбранные" />
                    </v-radio-group>

                    <AutocompleteSearchField
                        v-model="form.filter.product.ids"
                        :error-messages="form.errors.get('filter.product.ids')"
                        :error="form.errors.has('filter.product.ids')"
                        url="/products"
                        name="filter.product.ids"
                        label="Товар"
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

                    <v-radio-group v-model="form.filter.has_price" label="Наличие цены">
                        <v-radio :value="true" label="Да" />
                        <v-radio :value="false" label="Нет" />
                    </v-radio-group>

                    <v-radio-group v-model="form.filter.is_price_visible" label="Видимость цены на сайте">
                        <v-radio :value="true" label="Цена отображается" />
                        <v-radio :value="false" label="Цена не отображается" />
                    </v-radio-group>

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
                    <v-radio-group v-model="form.filter.has_short_description" label="Наличие краткого описания">
                        <v-radio :value="true" label="Есть описание" />
                        <v-radio :value="false" label="Нет описания" />
                    </v-radio-group>

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
import AutocompleteSearchField from '~/components/search/fields/AutocompleteSearchField';
import FieldValueAutocomplete from '~/components/forms/FieldValueAutocomplete';

export default {
    components: {
        FieldValueAutocomplete,
        AutocompleteSearchField,
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
                    selected: true,
                },
                brand: {
                    ids: [],
                    selected: true,
                },
                product: {
                    ids: [],
                    selected: true,
                },
                stock_type: {
                    ids: [],
                    selected: true,
                },
                availability: {
                    ids: [],
                    selected: true,
                },
                has_price: false,
                is_price_visible: false,
                max_price: 0,
                min_price: 0,
                has_short_description: true,
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
