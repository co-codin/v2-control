<template>
    <v-form @submit.prevent="linkProperties">
        <v-row>
            <v-tabs v-model="tab" grow background-color="transparent">
                <v-tab key="properties"> Характеристики </v-tab>
                <v-tab key="important_properties"> Коротко о товаре ({{ importantProperties.length }}) </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab" style="width: 100%">
                <v-tab-item key="properties">
                    <v-card flat>
                        <v-card-text>
                            <v-expansion-panels v-if="form && form.properties.length" class="mb-3">
                                <draggable v-model="form.properties" @update="updatePropertyPositions">
                                    <v-expansion-panel v-for="(property, index) in form.properties" :key="property.id">
                                        <v-expansion-panel-header class="title">{{ property.name }}</v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                            <v-switch
                                                v-model="property.is_in_variations"
                                                label="Использовать в модификации"
                                                dense
                                                inset
                                            />
                                            <v-select
                                                v-if="property.is_boolean"
                                                v-model="property.field_value_ids"
                                                label="Значение"
                                                :items="booleanItems"
                                                clearable
                                                dense
                                            />
                                            <field-value-autocomplete
                                                v-else
                                                v-model="property.field_value_ids"
                                                label="Значение"
                                                item-text="value"
                                                item-value="id"
                                                :multiple="true"
                                                :chips="true"
                                                :items="getItemsByIds(property.field_value_ids)"
                                                deletable-chips
                                                :query-params="{ sort: 'valueLength' }"
                                                dense
                                            />
                                            <v-text-field
                                                v-model="property.pretty_key"
                                                label="Отформатированное название для страницы товара"
                                                :error-messages="form.errors.get(`properties.${index}.pretty_key`)"
                                                :error="form.errors.has(`properties.${index}.pretty_key`)"
                                                dense
                                            />
                                            <v-text-field
                                                v-model="property.pretty_value"
                                                label="Отформатированное значение для страницы товара"
                                                :error-messages="form.errors.get(`properties.${index}.pretty_value`)"
                                                :error="form.errors.has(`properties.${index}.pretty_value`)"
                                                dense
                                            />
                                            <v-switch
                                                v-model="property.is_important"
                                                label="Отображать в блоке 'Коротко о товаре'"
                                                :error-messages="form.errors.get(`properties.${index}.is_important`)"
                                                :error="form.errors.has(`properties.${index}.is_important`)"
                                                dense
                                                inset
                                            />
                                            <div class="text-center mt-1">
                                                <v-btn small color="red" class="white--text" @click="removeProperty(index)"
                                                >Удалить</v-btn
                                                >
                                            </div>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </draggable>
                            </v-expansion-panels>
                            <v-alert v-else dense type="info" outlined>
                                К товару не добавлено ни одной характеристики
                            </v-alert>
                            <v-expansion-panels class="mt-3">
                                <v-expansion-panel>
                                    <v-expansion-panel-header class="title">
                                        Добавление характеристики
                                    </v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        <entity-autocomplete-field
                                            v-model="newProperty"
                                            placeholder="Введите название характеристики"
                                            return-object
                                            class="mt-0"
                                            url="/properties"
                                            :query-params="{ sort: 'name' }"
                                            item-value="id"
                                            item-text="name"
                                            search-column="name"
                                            filter-column="id"
                                            hide-no-data
                                        />
                                        <v-btn :disabled="!newProperty" small @click="addProperty"
                                            >Добавить характеристику</v-btn
                                        >
                                        <v-btn class="ml-2" small @click="openPropertyPopup"
                                            >Создать новую характеристику</v-btn
                                        >
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
                <v-tab-item key="important_properties">
                    <v-card flat>
                        <v-card-text>
                            <v-alert v-if="!importantProperties.length" dense type="info" outlined>
                                В блок "Коротко о товаре" не добавлено ни одной характеристики
                            </v-alert>
                            <div v-else>
                                <v-expansion-panels>
                                    <draggable v-model="importantProperties">
                                        <div v-for="(property, index) in importantProperties" :key="property.id">
                                            <v-expansion-panel>
                                                <v-expansion-panel-header class="title">{{
                                                    property.name
                                                }}</v-expansion-panel-header>
                                                <v-expansion-panel-content>
                                                    <v-text-field
                                                        v-model="property.important_value"
                                                        label="Отформатированное значение для блока 'Коротко о товаре'"
                                                        dense
                                                        :error-messages="
                                                            form.errors.get(`properties.${index}.important_value`)
                                                        "
                                                        :error="form.errors.has(`properties.${index}.important_value`)"
                                                    />
                                                    <div class="text-center mt-1">
                                                        <v-btn
                                                            small
                                                            color="red"
                                                            class="white--text"
                                                            @click="property.is_important = false"
                                                            >Удалить из блока "Коротко о товаре"</v-btn
                                                        >
                                                    </div>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel>
                                        </div>
                                    </draggable>
                                </v-expansion-panels>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
        </v-row>
        <v-row class="expansion-panel-actions">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
        <v-dialog v-model="newPropertyPopup" max-width="600" width="600">
            <v-card tile outlined>
                <v-card-title> Создание сквозной характеристики </v-card-title>
                <v-card-text>
                    <property-form @send="createProperty" />
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-form>
</template>

<script>
import Form from 'form-backend-validation';
import { mapGetters, mapMutations } from 'vuex';
import draggable from 'vuedraggable';
import FieldValueAutocomplete from '~/components/forms/FieldValueAutocomplete';
import FieldValue from '~/models/FieldValue';
import EntityAutocompleteField from '~/components/forms/EntityAutocompleteField';
import PropertyForm from '~/modules/property/components/PropertyForm';
import sortBy from 'lodash/sortBy'

export default {
    components: {
        PropertyForm,
        FieldValueAutocomplete,
        EntityAutocompleteField,
        draggable,
    },
    data: () => ({
        values: null,
        show: false,
        form: null,
        propertyForm: null,
        formDefaults: {
            properties: [],
        },
        propertyFormDefaults: {
            name: null,
            is_boolean: false,
        },
        newProperty: null,
        newPropertyPopup: false,
        tab: 'properties',
        draggableItems: null,
        booleanItems: [
            { text: 'Да', value: 1 },
            { text: 'Нет', value: 2 },
        ],
    }),
    async created() {
        const valueIds = this.product.properties
            .map((property) => property.pivot.field_value_ids)
            .flat()
            .filter((value, index, self) => self.indexOf(value) === index);
        const values = await FieldValue.select({
            field_values: ['id', 'value']
        })
            .whereIn('id', valueIds)
            .params({
                'page[size]': 1000,
            })
            .$get();
        this.values = Object.fromEntries(values.map((item) => [item.id, item.value]));
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios, resetOnSuccess: false })
            .populate({
                properties: this.transformProperties(this.product.properties || []),
            });
        this.propertyForm = Form.create(this.propertyFormDefaults).withOptions({
            http: this.$axios,
            resetOnSuccess: true,
        });
    },
    computed: {
        ...mapGetters({
            product: 'product/product',
        }),
        importantProperties: {
            get() {
                return sortBy(this.form?.properties?.filter((property) => property.is_important) || [], ['important_position', 'name'])
            },
            set(value) {
                let i = 0
                value.forEach((importantProperty) => {
                    const property = this.form.properties.find((property) => property.id === importantProperty.id)
                    property.important_position = ++i
                })
            }
        },
    },

    beforeDestroy() {},
    methods: {
        ...mapMutations({
            closeAllPanels: 'helper/closeAllPanels',
        }),
        getItemsByIds(ids) {
            if (!ids) {
                return [];
            }
            if (!Array.isArray(ids)) {
                ids = [ids];
            }
            return ids.map((id) => ({
                id,
                value: this.values[id],
            }));
        },
        transformProperties(properties) {
            const mappedProperties = properties
                .map((property) => ({
                    ...property.pivot,
                    id: property.id,
                    name: property.name,
                    is_boolean: property.is_boolean,
                    is_numeric: property.is_numeric,
                }))

            return sortBy(mappedProperties, ['position', 'name'])
        },
        removeProperty(index) {
            this.form.properties.splice(index, 1);
        },
        addProperty() {
            if (!this.newProperty) {
                this.newProperty = null;
                this.$snackbar('Выберите характеристику');
                return;
            }
            if (this.form.properties.some((property) => property.id === this.newProperty.id)) {
                this.newProperty = null;
                this.$snackbar('Такая характеристика уже добавлена к товара');
                return;
            }
            this.form.properties.push({
                id: this.newProperty.id,
                name: this.newProperty.name,
                field_value_ids: null,
                pretty_key: null,
                pretty_value: null,
                is_boolean: this.newProperty.is_boolean,
                important_value: null,
                is_important: false,
            });
            this.newProperty = null;
        },
        openPropertyPopup() {
            this.newPropertyPopup = true;
        },
        async createProperty(form) {
            try {
                const { data } = await form.post('/admin/properties');
                this.form.properties.push({
                    id: data.id,
                    name: data.name,
                    is_boolean: data.is_boolean,
                    important_value: null,
                    field_value_ids: null,
                    is_important: false,
                    is_in_variations: false,
                });
                this.newPropertyPopup = false;
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании характеристики: ${e.message}`);
            }
        },
        async linkProperties() {
            try {
                await this.form.put(`admin/products/${this.$route.params.id}/properties`);
                this.$snackbar(`Характиристики товара успешно обновлены`);
                this.closeAllPanels();
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
        updatePropertyPositions() {
            let i = 0
            this.form.properties.forEach((property) => {
                property.position = ++i
            })
        },
    },
};
</script>

<style type="text/css" scoped>
.v-expansion-panels > *:last-child {
    width: 100%;
}
</style>
