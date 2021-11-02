<template>
    <v-form @submit.prevent="$emit('send', form)">
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
                                <v-expansion-panel v-for="(property, index) in form.properties" :key="property.id">
                                    <v-expansion-panel-header class="title">{{
                                        property.name
                                    }}</v-expansion-panel-header>
                                    <v-expansion-panel-content>
                                        <field-value-autocomplete
                                            v-model="property.field_value_ids"
                                            label="Значение"
                                            item-text="value"
                                            item-value="id"
                                            :multiple="property.is_multiple"
                                            :chips="property.is_multiple"
                                            :items="getItemsByIds(property.field_value_ids)"
                                            deletable-chips
                                            :query-params="{ sort: 'valueLength' }"
                                            dense
                                        />
                                        <v-text-field
                                            v-model="property.pretty_key"
                                            label="Отформатированное название для страницы товара"
                                            dense
                                        />
                                        <v-text-field
                                            v-model="property.pretty_value"
                                            label="Отформатированное значение для страницы товара"
                                            dense
                                        />
                                        <v-switch
                                            v-model="property.is_important"
                                            label="Отображать в блоке 'Коротко о товаре'"
                                            dense
                                        />
                                        <div class="text-center mt-1">
                                            <v-btn small color="red" class="white--text" @click="removeProperty(index)"
                                                >Удалить</v-btn
                                            >
                                        </div>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
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
                                    <draggable
                                        @update="updatePropertyPositions"
                                        v-model="draggableItems"
                                    >
                                        <v-expansion-panel v-for="(property, index) in importantProperties" :key="property.id">
                                            <v-expansion-panel-header class="title">{{
                                                    property.name
                                                }}</v-expansion-panel-header>
                                            <v-expansion-panel-content>
                                                <v-text-field
                                                    v-model="property.important_value"
                                                    label="Отформатированное значение для блока 'Коротко о товаре'"
                                                    dense
                                                    required
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
                <v-btn type="submit" color="green" class="white--text text-uppercase" @click="linkProperties"
                    >Сохранить</v-btn
                >
            </v-col>
        </v-row>
        <v-dialog v-model="newPropertyPopup" max-width="450" width="600">
            <v-card tile outlined>
                <v-form v-if="propertyForm" @submit.prevent="createProperty">
                    <v-card-title> Создание сквозной характеристики </v-card-title>
                    <v-card-text>
                        <v-text-field
                            v-model="propertyForm.name"
                            label="Название"
                            :error-messages="propertyForm.errors.get('name')"
                            :error="propertyForm.errors.has('name')"
                        />
                        <v-checkbox
                            v-model="propertyForm.is_multiple"
                            label="Множественное значение"
                            :error-messages="propertyForm.errors.get('is_multiple')"
                            :error="propertyForm.errors.has('is_multiple')"
                        />
                    </v-card-text>
                    <v-card-actions>
                        <v-btn type="submit" small color="green" class="white--text text-uppercase"
                            >Создать характеристику
                        </v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </v-form>
</template>

<script>
import Form from 'form-backend-validation';
import { mapGetters } from 'vuex';
import FieldValueAutocomplete from '~/components/forms/FieldValueAutocomplete';
import FieldValue from '~/models/FieldValue';
import EntityAutocompleteField from '~/components/forms/EntityAutocompleteField';
import Sortable from 'sortablejs';
import draggable from "vuedraggable";

export default {
    components: {
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
            is_multiple: false,
        },
        newProperty: null,
        newPropertyPopup: false,
        tab: 'properties',
        draggableItems: null,
    }),
    async created() {
        const valueIds = this.product.properties
            .map((property) => property.pivot.field_value_ids)
            .flat()
            .filter((value, index, self) => self.indexOf(value) === index);
        const values = await FieldValue.select('id', 'value').whereIn('id', valueIds).limit(200).$get();
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
        importantProperties() {
            return this.form?.properties || [];
            // return this.form?.properties?.filter((property) => property.is_important) || [];
        },
    },
    mounted() {
        // Sortable.create(this.$refs["draggable-items"]);
    },
    beforeDestroy() {

    },
    methods: {
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
            return properties
                .map((property) => ({
                    ...property.pivot,
                    id: property.id,
                    name: property.name,
                }))
                .sort((a, b) => {
                    let ret = 0;
                    if (a.name < b.name) {
                        ret = -1;
                    }
                    if (a.name > b.name) {
                        ret = 1;
                    }
                    return ret;
                });
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
            });
            this.newProperty = null;
        },
        openPropertyPopup() {
            this.newPropertyPopup = true;
        },
        async createProperty() {
            const { data } = await this.propertyForm.post('/admin/properties');
            this.form.properties.push({
                id: data.id,
                name: data.name,
                is_multiple: data.is_multiple,
                field_value_ids: null,
            });
            this.newPropertyPopup = false;
        },
        async linkProperties() {
            await this.form.put(`admin/products/${this.$route.params.id}/properties`);
        },
        updatePropertyPositions(e, l) {
            console.log(e, l);
        },
    },
};
</script>

<style type="text/css" scoped>
.v-expansion-panels > *:last-child {
    width: 100%;
}
</style>
