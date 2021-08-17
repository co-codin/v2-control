<template>
  <v-autocomplete

  />
</template>

<script>
import { VAutocomplete } from "vuetify/lib";

export default VAutocomplete.extends({
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    isLoading: false,
    foundItems: [],
    search: null,
  }),
  methods: {
    async searchItems(query) {
      this.isLoading = true;
      const params = {};
      params[`filter[${this.itemText}]`] = query;
      const { data } = await this.$axios.get(this.url, { params });
      this.foundItems = data.data;
      this.isLoading = false;
    },
    async loadItems() {
      if(!this.value) return;
      this.isLoading = true;
      const params = {};
      params[`filter[${this.itemValue}]`] = this.value;
      const { data } = await this.$axios.get(this.url, { params });
      this.foundItems = data.data;
      this.isLoading = false;
    },
  },
  watch: {
    async search(value) {
      await this.searchItems(value);
    },
  },
  async created() {
    await this.loadItems();
  }
});
</script>
