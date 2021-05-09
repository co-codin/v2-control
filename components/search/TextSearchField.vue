<template>
  <div>
    <v-text-field :value="value" @input="$emit('input', $event)" dense :label="label" />
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
  },
}
</script>
