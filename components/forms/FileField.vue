<template>
  <div>
    <div v-if="isUploaded">
      <img :src="'127.0.0.1:8000/storage/' + value" alt="" width="200">
      <v-btn @click="$emit('input', null)">Удалить</v-btn>
    </div>
    <v-file-input
      v-bind="$attrs"
      v-else
      :value="value"
      label="Логотип"
      @change="$emit('input', $event)"
    ></v-file-input>
  </div>
</template>

<script>
export default{
  props: {
    value: {
      default: null,
      type: String | File,
    },
  },
  computed: {
    isUploaded() {
      return typeof this.value === "string";
    }
  },
};
</script>
