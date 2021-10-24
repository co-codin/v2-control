<template>
  <div>
    <div v-if="isUploaded">
      <div class="position-relative d-inline-block">
        <v-img
          contain
          max-height="250"
          max-width="250"
          :src="url"
        />
        <div style="position: absolute; right: 15px; top: 5px;">
          <v-btn
            style="background: white; padding: 3px;"
            icon
            shaped
            small
            @click="$emit('input', null)"
            color="error"
          >
            <trash-icon></trash-icon>
          </v-btn>
        </div>
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
import TrashIcon from "@/components/heroicons/TrashIcon";

export default {
  components: {
    TrashIcon,
  },
  props: {
    value: {
      default: null,
      type: String | File,
    },
  },
  computed: {
    isUploaded() {
      return typeof this.value === "string";
    },
    url() {
      return `${this.$config.app.storageUrl}/${this.value}`;
    },
  },
};
</script>
