<template>
    <v-form @submit.prevent="save">
        <v-select
            v-model="form.type"
            :items="typeLabels"
            label="Метод фильтрации"
            :error-messages="form.errors.get('type')"
            :error="form.errors.has('type')"
            @input="form.facet.name = null; updateFacetPath()"
        />
        <field-value-autocomplete
            v-if="filter.type === 3"
            v-model="form.facet.value"
            label="Значение для поиска"
            :error-messages="form.errors.get('facet.value')"
            :error="form.errors.has('facet.value')"
            @input="form.facet.name = null; updateFacetPath()"
        />
        <v-select
            v-model="form.is_system"
            :items="isSystemTypeLabels"
            label="Тип"
            :error-messages="form.errors.get('is_system')"
            :error="form.errors.has('is_system')"
        />
        <entity-autocomplete-field
            v-if="!form.is_system"
            v-model="form.facet.property_id"
            url="/properties"
            item-value="id"
            item-text="name"
            :query-params="propertyQueryParams"
            :error-messages="form.errors.get('facet.property_id')"
            :error="form.errors.has('facet.property_id')"
            placeholder="Введите название характеристики"
            label="Характеристика"
            filter-column="id"
            search-column="live"
            hide-no-data
            cache-items
            clearable
            @input="form.facet.name = null; form.facet.path = null"
        />
        <v-select
            v-else
            v-model="form.facet.name"
            label="Системное поле"
            :items="systemFilters"
            item-text="name_ru"
            item-value="name"
            :error-messages="form.errors.get('facet.name')"
            :error="form.errors.has('facet.name')"
            @change="form.property_id = null; updateFacetPath()"
        />
        <v-row class="expansion-panel-actions mt-5">
            <v-col>
                <v-btn type="submit" disabled color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import { Form } from 'form-backend-validation';
import { systemFilters } from '~/enums';
import EntityAutocompleteField from "~/components/forms/EntityAutocompleteField";
import FieldValueAutocomplete from "~/components/forms/FieldValueAutocomplete";
import Filter from "~/modules/filter/models/Filter";

export default {
    components: {
        EntityAutocompleteField,
        FieldValueAutocomplete,
    },
    props: {
        filter: {
            type: Object | null,
            default: () => ({}),
        },
    },
    data: () => ({
        formDefaults: {
            is_system: false,
            type: null,
            facet: {
                name: null,
                path: null,
                value: null,
            },
        },
        form: null,
        isSystemTypeLabels: [
            { value: true, text: 'Системный' },
            { value: false, text: 'Пользовательский' },
        ],
        typeLabels: [
            { value: 1, text: 'Список галочек' },
            { value: 2, text: 'Слайдер' },
            { value: 3, text: 'Галочка' },
        ],
    }),
    computed: {
        systemFilter() {
            if (!this.form.facet.name) {
                return null;
            }
            return systemFilters.find((filter) => filter.name === this.form.facet.name);
        },
        propertyQueryParams() {
            let params = {sort: 'name'};
            if(this.form.type === 2) {
                params['filter[is_numeric]'] = 1;
            }
            if(this.form.type === 1) {
                params['filter[is_boolean]'] = 0;
            }
            return params;
        },
        systemFilters() {
            return systemFilters.sort((a, b) => a.name_ru.localeCompare(b.name_ru))
                .filter(a => this.form.type !== 2 || !! a?.is_numeric);
        },
    },
    watch: {
        filter(value) {
            this.form.populate(value);
        },
    },
    created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.filter || {});
    },
    methods: {
        updateFacetPath() {
            this.form.facet.path = this.systemFilter?.path ?? null;
        },
        async save() {
            this.$snackbar('Редактирование блока отключено');
            return;
            try {
                const { data } = await this.form.put(`/admin/filters/${this.filter.id}`);
                this.$snackbar(`Фильтр успешно обновлен`);
                this.$emit('save', new Filter(data));
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
