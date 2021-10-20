<template>
  <div>
    <entity-autocomplete-field
      url="/brands"
      v-model="brand_ids"
      item-value="id"
      :item-text="getBrandText"
      placeholder="Введите название производителя"
      filter-column="id"
      search-column="name"
      multiple
      hide-no-data
      cache-items
    />
  </div>
</template>

<script>
import EntityAutocompleteField from "../components/forms/EntityAutocompleteField";
export default {
  components: {
    EntityAutocompleteField,
  },
  data: () => ({
    brand_ids: [1, 2, 3],
  }),
  methods: {
    getBrandText(brand) {
      return brand.name + ' (' + brand.slug + ')';
    },
  },
}
</script>
