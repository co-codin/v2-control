<template>
    <v-autocomplete
        v-bind="$attrs"
        :items="fieldItems"
        :loading="isLoading"
        @input="$emit('input', $event)"
        @keyup="searchItems($event.target.value)"
        :search-input.sync="searchInput"
    >
        <template slot="no-data">
            <div class="pl-2 pr-2">
                Ничего не найдено. <v-btn text @click="addValue">Добавить?</v-btn>
            </div>
        </template>
    </v-autocomplete>
</template>

<script>
import FieldValue from "~/models/FieldValue";

export default {
    props: {
        items: {
            type: Array,
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
    async created() {
        if (this.value && !this.items) {
            await this.loadItems();
        }
    },
    watch: {
        async "$attrs.value"() {
            await this.loadItems();
        },
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
            const fieldValue = new FieldValue({ value: this.searchInput });
            try {
                await fieldValue.save();
            }
            catch (e) {
                this.$snackbar('Произошла ошибка при создании');
            }
        },
    },
};
</script>
