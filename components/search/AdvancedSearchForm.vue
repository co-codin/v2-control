<template>
    <v-form @submit.prevent="$emit('search', search)">
        <v-text-field
            dense
            prepend-inner-icon="mdi-magnify"
            solo
            placeholder="Быстрый поиск"
            :value="value[fastFilterName]"
            append-icon="mdi-filter"
            class="mb-2"
            hide-details
            @input="fastSearch"
            @click:append="toggleFullSearchForm"
        />

        <v-card v-show="isFullSearchFormVisible" class="mb-2">
            <v-card-text>
                <component
                    :is="filter.component"
                    v-for="filter in filters"
                    v-show="filter.name !== fastFilterName"
                    :key="filter.name"
                    :value="value[filter.name]"
                    v-bind="filter"
                    class="mb-3"
                    @input="search(filter.name, $event)"
                />
            </v-card-text>
        </v-card>

        <div class="filter-chips mb-1">
            <portal-target v-for="filter in filters" :key="filter.name" slim :name="`filter-${filter.name}-chips`" />
        </div>
    </v-form>
</template>

<script>
import { debounce } from 'lodash';

export default {
    props: {
        filters: {
            type: Array,
            required: true,
        },
        value: {
            default: () => ({}),
        },
        fastFilterName: {
            type: String,
            default: 'name',
        },
    },
    data: () => ({
        isFullSearchFormVisible: false,
    }),
    methods: {
        fastSearch: debounce(function (value) {
            this.search(this.fastFilterName, value);
        }, 200),
        toggleFullSearchForm() {
            this.isFullSearchFormVisible = !this.isFullSearchFormVisible;
        },
        search(key, value) {
            this.$emit('search', { ...this.value, [key]: value });
        },
    },
};
</script>

<style>
.filter-chips > div {
    display: inline-block;
}
.filter-chips .v-chip {
    margin-right: 4px;
    margin-bottom: 4px;
}
</style>
