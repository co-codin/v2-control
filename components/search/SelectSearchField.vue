<template>
  <div>
    <v-select
      :items="items"
      :value="value"
      @change="$emit('input', $event)"
      :label="label"
      dense
      :multiple="multiple"
    />
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
    items: {
      type: Array,
      required: true,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
