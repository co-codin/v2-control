<template>
    <v-autocomplete
        v-bind="$attrs"
        :items="fieldItems"
        :loading="isLoading"
        :search-input.sync="searchInput"
        :value="value"
        item-value="id"
        item-text="value"
        @input="$emit('input', $event)"
        @keyup="searchItems($event.target.value)"
    >
        <template v-if="searchInput" slot="no-data">
            <div class="pl-2 pr-2">Ничего не найдено. <v-btn text @click="addValue">Добавить?</v-btn></div>
        </template>
    </v-autocomplete>
</template>

<script>
import FieldValue from '~/models/FieldValue';

export default {
    props: {
        items: {
            type: Array,
        },
        value: {
            default: null,
        },
    },
    data: () => ({
        isLoading: false,
        loadedItems: null,
        searchInput: null,
    }),
    computed: {
        fieldItems() {
            return this.loadedItems ? this.loadedItems : this.items;
        },
    },
    watch: {
        '$attrs.value': async function () {
            await this.loadItems();
        },
    },
    async created() {
        if (this.value && !this.items) {
            await this.loadItems();
        }
    },
    methods: {
        async searchItems(query) {
            if (!query) return;
            this.isLoading = true;
            this.loadedItems = await FieldValue.select('id', 'value')
                .where('value', query)
                .orderBy('valueLength')
                .$get();
            this.isLoading = false;
        },
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
                this.loadedItems.push({
                    data: [data],
                });
                this.$snackbar(`${this.searchInput} добавлен`);
            } catch (e) {
                this.$snackbar('Произошла ошибка при создании');
            }
        },
    },
};
</script>
