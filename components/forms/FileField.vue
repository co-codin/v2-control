<template>
  <div>
    <div v-if="isUploaded">
      <div class="position-relative d-inline-block">
        <v-img
          contain
          max-height="250"
          max-width="250"
          :src="'https://api.medeq.ru/storage/' + value"
        />
        <v-btn
          icon
          shaped
          absolute
          right
          top
          small
          @click="$emit('input', null)"
          color="error"
        >
          <v-icon>mdi-trash-can-outline</v-icon>
        </v-btn>
      </div>
    </div>
    <v-file-input
      v-else
      :value="value"
      @change="$emit('input', $event)"
      v-bind="$attrs"
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
