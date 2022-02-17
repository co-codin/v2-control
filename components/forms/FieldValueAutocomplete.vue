<template>
    <v-autocomplete
        v-bind="$attrs"
        :items="loadedItems"
        :loading="isLoading"
        :search-input.sync="searchInput"
        :value="value"
        item-value="id"
        item-text="value"
        :multiple="multiple"
        clearable
        @change="$emit('input', $event)"
        @keyup="searchItems($event.target.value)"
    >
        <template v-if="searchInput" slot="no-data">
            <div class="pl-2 pr-2">Ничего не найдено. <v-btn text @click="addValue">Добавить?</v-btn></div>
        </template>
    </v-autocomplete>
</template>

<script>
import { debounce } from 'lodash';
import FieldValue from '~/models/FieldValue';

export default {
    props: {
        items: {
            type: Array,
            default: () => [],
        },
        value: {
            default: null,
        },
        multiple: {
            default: false,
        },
    },
    data() {
        return {
            isLoading: false,
            loadedItems: [...this.items],
            searchInput: null,
        };
    },
    watch: {
        '$attrs.value': async function () {
            await this.loadItems();
        },
    },
    async created() {
        if (this.value && !this.loadedItems.length) {
            await this.loadItems();
        }
    },
    methods: {
        searchItems: debounce(async function (query) {
            if (!query) return;
            this.isLoading = true;
            const items = await FieldValue.select('id', 'value').where('value', query).orderBy('valueLength').$get();
            this.loadedItems = this.loadedItems.concat(items);
            this.isLoading = false;
            this.searchInput = '';
        }, 200),
        async loadItems() {
            this.isLoading = true;
            this.loadedItems = await FieldValue.select('id', 'value')
                .whereIn('id', Array.isArray(this.value) ? this.value : [this.value])
                .$get();
            this.isLoading = false;
        },
        async addValue() {
            try {
                const { data } = await this.$axios.$post('/admin/field-values', {
                    value: this.searchInput,
                });
                this.loadedItems.push(new FieldValue(data));
                this.$emit('input', this.multiple ? [...this.value, data.id] : data.id);
                this.$snackbar(`${this.searchInput} добавлен`);
            } catch (e) {
                this.$snackbar('Произошла ошибка при создании');
            }
        },
    },
};
</script>
