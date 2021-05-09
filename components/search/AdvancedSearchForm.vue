<template>
  <v-form @submit.prevent="$emit('search', search)">
    <component
      v-for="filter in filters"
      :key="filter.name"
      :is="filter.component"
      v-model="search[filter.name]"
      v-bind="filter"
    />
    <v-btn type="submit" class="mt-2 mb-2">Найти</v-btn>
  </v-form>
</template>

<script>
export default {
  props: {
    filters: {
      type: Array,
      required: true,
    },
    value: {
      default: () => ({}),
    },
  },
  data: () => ({
    search: {},
  }),
  created() {
    this.search = Object.assign({}, {...this.value});
  },
  watch: {
    value(value) {
      this.search = Object.assign({}, {...this.value});
    }
  }
}
</script>
