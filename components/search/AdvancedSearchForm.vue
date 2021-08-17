<template>
  <v-form @submit.prevent="$emit('search', search)">

    <v-text-field
      dense
      prepend-inner-icon="mdi-magnify"
      solo
      placeholder="Быстрый поиск"
      @input="fastSearch"
      :value="value[fastFilterName]"
      append-icon="mdi-filter"
      @click:append="toggleFullSearchForm"
      class="mb-2"
      hide-details
    />

    <v-card v-show="isFullSearchFormVisible" class="mb-2">
        <v-card-text>
          <component
            v-show="filter.name !== fastFilterName"
            v-for="filter in filters"
            :key="filter.name"
            :is="filter.component"
            :value="value[filter.name]"
            v-bind="filter"
            @input="search(filter.name, $event)"
            class="mb-3"
          />
        </v-card-text>
    </v-card>

    <div class="filter-chips mb-1">
      <portal-target
        slim
        v-for="filter in filters"
        :key="filter.name"
        :name="`filter-${filter.name}-chips`"
      />
    </div>

  </v-form>
</template>

<script>
import { debounce } from "lodash";

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
    fastSearch: debounce(function(value) {
      this.search(this.fastFilterName, value);
    }, 200),
    toggleFullSearchForm() {
      this.isFullSearchFormVisible = !this.isFullSearchFormVisible;
    },
    search(key, value) {
      this.$emit('search', { ...this.value, [key]: value })
    },
  }
}
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
