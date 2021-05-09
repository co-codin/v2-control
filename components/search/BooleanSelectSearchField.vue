<template>
  <div>
    <v-select
      :items="items"
      :value="value"
      @change="$emit('input', $event)"
      :label="label"
      dense
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
      default: () => ([
        { value: "1", text: 'Да' },
        { value: "0", text: 'Нет' },
      ]),
    },
  },
}
</script>
