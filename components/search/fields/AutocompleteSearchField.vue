<template>
    <div>
        <v-autocomplete
            :items="items"
            :value="formattedValue"
            :loading="isLoading"
            :search-input.sync="search"
            cache-items
            placeholder="Начните вводить для поиска"
            :multiple="true"
            v-bind="$props"
            @change="search = ''"
            @input="$emit('input', $event)"
            dense
        >
            <template #selection="data">
                <v-chip small v-bind="data.attrs" :input-value="data.selected" close @click="data.select" @click:close="removeValue(data.item)">
                    {{ data.item.name }}
                </v-chip>
            </template>
        </v-autocomplete>

        <portal v-if="chips.length" :to="`filter-${name}-chips`">
            <div>
                <v-chip
                    v-for="(chip, index) in chips"
                    :key="'category-' + index"
                    close
                    @click:close="removeChip(chip.value)"
                >
                    {{ label }}: {{ chip.label }}
                </v-chip>
            </div>
        </portal>
    </div>
</template>

<script>
import { debounce } from 'lodash';

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
        searchColumn: {
            type: String,
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
    computed: {
        chips() {
            if (!this.value) {
                return [];
            }
            return [this.value].flat().map((id) => ({
                value: id,
                label: this.items.find((entry) => entry.id === +id)?.name,
            }));
        },
        formattedValue() {
            if(!this.value) {
                return [];
            }

            return this.value.map(item => +item);
        },
    },
    methods: {
        searchItems: debounce(async function(query) {
            this.isLoading = true;
            const params = {};
            params[`filter[${this.searchColumn ?? this.itemText}]`] = query;
            const { data } = await this.$axios.get(this.url, { params });
            this.items = data.data;
            this.isLoading = false;
        }, 300),
        async loadItems() {
            if (!this.value) return;
            this.isLoading = true;
            const params = {};
            params[`filter[${this.itemValue}]`] = this.value;
            const { data } = await this.$axios.get(this.url, { params });
            this.items = data.data;
            this.isLoading = false;
        },
        removeChip(e) {
            const value = [...this.value];
            value.splice(this.value.indexOf(e), 1);
            this.$emit('input', value);
        },
        removeValue (item) {
            this.removeChip(item);
            // const value = [...this.value];
            // value.splice(this.value.indexOf(e), 1);
            // this.$emit('input', value);
            //
            // const index = this.friends.indexOf(item.name)
            // if (index >= 0) this.friends.splice(index, 1)
        },
    },
};
</script>
