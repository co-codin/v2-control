<template>
    <v-card tile :loading="!values">
        <v-form @submit.prevent="$emit('send', form)" v-if="form">
            <v-card-title>Характеристики</v-card-title>
            <v-card-text v-if="values">
                <v-card v-for="(property, index) in form.properties" :key="property.id" class="mt-2">
                    <v-card-title>
                        {{ property.name }}
                    </v-card-title>
                    <v-card-text>
                        <field-value-autocomplete
                            label="Значение"
                            item-text="value"
                            item-value="id"
                            :multiple="property.is_multiple"
                            :chips="property.is_multiple"
                            :items="getItemsByIds(property.field_value_ids)"
                            deletable-chips
                            v-model="property.field_value_ids"
                            :query-params="{ sort: 'valueLength' }"
                        ></field-value-autocomplete>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn small color="red" class="white--text" @click="removeProperty(index)">Удалить</v-btn>
                    </v-card-actions>
                </v-card>
                <v-card tile outlined class="mt-3">
                    <v-card-title>
                        Добавление характеристики
                    </v-card-title>
                    <v-card-text>
                        <entity-autocomplete-field placeholder="Введите название характеристики" return-object v-model="newProperty" class="mt-0" url="/properties" :query-params="{ sort: 'name' }" item-value="id" item-text="name"  search-column="name" filter-column="id" />
                    </v-card-text>
                    <v-card-actions>
                        <v-btn :disabled="!newProperty" small @click="addProperty">Добавить характеристику</v-btn>
                        <v-btn  class="ml-2" small @click="openPropertyPopup">Создать новую характеристику</v-btn>
                    </v-card-actions>
                </v-card>
            </v-card-text>
            <v-card-actions>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-card-actions>
        </v-form>
        <v-dialog
            v-model="newPropertyPopup"
            max-width="450"
            width="600"
        >
            <v-card tile outlined>
                <v-form @submit.prevent="createProperty" v-if="propertyForm">
                    <v-card-title>
                        Создание сквозной характеристики
                    </v-card-title>
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
                        <v-btn type="submit" small color="green" class="white--text text-uppercase">Создать характеристику</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
import Form from 'form-backend-validation';
import FieldValueAutocomplete from '~/components/forms/FieldValueAutocomplete';
import FieldValue from '~/models/FieldValue';
import EntityAutocompleteField from '~/components/forms/EntityAutocompleteField';

export default {
    components: {
        FieldValueAutocomplete,
        EntityAutocompleteField,
    },
    props: {
        properties: {
            type: Array,
            default: () => [],
        },
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
    }),
    async created() {
        const valueIds = this.properties
            .map((property) => property.pivot.field_value_ids)
            .flat()
            .filter((value, index, self) => self.indexOf(value) === index);
        const values = await FieldValue.select('id', 'value').whereIn('id', valueIds).limit(200).$get();
        this.values = Object.fromEntries(values.map((item) => [item.id, item.value]));

        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios, resetOnSuccess: false })
            .populate({
                properties: this.transformProperties(this.properties || [])
            });

        this.propertyForm = Form.create(this.propertyFormDefaults)
            .withOptions({ http: this.$axios, resetOnSuccess: true });
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
            return properties.map(property => ({
                ...property.pivot,
                id: property.id,
                name: property.name,
            }));
        },
        removeProperty(index) {
            this.form.properties.splice(index, 1);
        },
        addProperty() {
            if(!this.newProperty) {
                this.newProperty = null;
                this.$snackbar('Выберите характеристику');
                return;
            }
            if(this.form.properties.some(property => property.id === this.newProperty.id)) {
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
        createProperty() {
            this.propertyForm.post('/admin/properties').then(response => {
                this.form.properties.push({
                    id: response.data.id,
                    name: response.data.name,
                    is_multiple: response.data.is_multiple,
                    field_value_ids: null,
                });
                this.newPropertyPopup = false;
            });
        },
    },
};
</script>
