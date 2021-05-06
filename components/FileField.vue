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
import { defineComponent, computed } from "@nuxtjs/composition-api";

export default defineComponent({
  props: {
    value: {
      default: null,
      type: String | File,
    },
  },
  setup(props) {
    const isUploaded = computed(() => typeof props.value === "string");
    return { isUploaded };
  }
});
</script>
