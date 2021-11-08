<template>
    <div>
        <v-autocomplete
            :items="items"
            :loading="isLoading"
            :search-input.sync="search"
            cache-items
            placeholder="Начните вводить для поиска"
            :multiple="true"
            v-bind="$props"
            @change="search = ''"
            @input="$emit('input', $event)"
        >
            <template #selection="data">
                <v-chip v-bind="data.attrs" :input-value="data.selected" close @click="data.select">
                    {{ data.item.name }}
                </v-chip>
            </template>
        </v-autocomplete>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            default: null,
        },
        label: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        itemValue: {
            type: String,
            default: 'id',
        },
        itemText: {
            type: String,
            default: 'name',
        },
        url: {
            type: String,
            required: true,
        },
    },
    data: () => ({
        isLoading: false,
        items: [],
        search: null,
    }),
    watch: {
        search(value) {
            this.searchItems(value);
        },
    },
    created() {
        this.loadItems();
    },
    methods: {
        async searchItems(query) {
            this.isLoading = true;
            const params = {};
            params[`filter[${this.itemText}]`] = query;
            const { data } = await this.$axios.get(this.url, { params });
            this.items = data.data;
            this.isLoading = false;
        },
        async loadItems() {
            if (!this.value) return;
            this.isLoading = true;
            const params = {};
            params[`filter[${this.itemValue}]`] = this.value;
            const { data } = await this.$axios.get(this.url, { params });
            this.items = data.data;
            this.isLoading = false;
        },
    },
};
</script>
