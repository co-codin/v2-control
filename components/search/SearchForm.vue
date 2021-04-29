<template>
  <div>

    <v-text-field
      placeholder="Поиск по производителям"
      :value="value"
      @input="$emit('input', $event)"
    />



<!--    <v-text-field :value="value"></v-text-field>-->

  </div>
</template>

<script>
export default {
  props: {
    value: {
      default: null,
    }
  },
  setup() {

  },
}
</script>
