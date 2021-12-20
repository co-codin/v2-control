<template>
    <v-autocomplete
        v-bind="$attrs"
        :items="items"
        :loading="isLoading"
        @input="$emit('input', $event)"
        @keyup="searchItems($event.target.value)"
    />
</template>

<script>
import { debounce } from 'lodash';

export default {
    props: {
        url: {
            type: String,
            required: true,
        },
        searchColumn: {
            type: String,
            required: true,
        },
        filterColumn: {
            type: String,
            required: true,
        },
        queryParams: {
            type: Object,
        },
    },
    data: () => ({
        isLoading: false,
        items: [],
    }),
    methods: {
        searchItems: debounce(async function (query) {
            if (!query) {
                return;
            }
            this.isLoading = true;
            const params = { ...this.queryParams };
            params[`filter[${this.searchColumn}]`] = query;
            try {
                const { data } = await this.$axios.get(this.url, { params });
                this.items = data.data;
            } catch (e) {
                this.$snackbar(e.message);
            }
            this.isLoading = false;
        }, 200),
        async loadItems() {
            if (!this.$attrs.value) return;
            this.isLoading = true;
            const params = { ...this.queryParams };
            params[`filter[${this.filterColumn}]`] = this.$attrs.value;
            const { data } = await this.$axios.get(this.url, { params });
            this.items = data.data;
            this.isLoading = false;
        },
    },
    watch: {
        '$attrs.value': async function () {
            await this.loadItems();
        },
    },
    async created() {
        await this.loadItems();
    },
};
</script>
