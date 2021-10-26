<template>
  <div>
    <div v-if="isUploaded">
      <div class="v-label v-label-active theme--light">
        {{ $attrs.label }}
      </div>
      <div class="position-relative d-inline-block" style="min-width: 100px; min-height: 100px;">
        <v-img
          v-if="isImage"
          contain
          max-height="250"
          max-width="250"
          :src="url"
        />
        <document-text-icon width="100" height="100" v-else />
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


          <v-card>

          </v-card>

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
import DocumentTextIcon from "@/components/heroicons/DocumentTextIcon";

export default {
  components: {
    TrashIcon,
    DocumentTextIcon,
  },
  props: {
    value: {
      default: null,
      type: String | File,
    },
    isImage: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    isUploaded() {
      return typeof this.value === "string";
    },
    url() {
      return this.isImage ? `${this.$config.app.storageUrl}/${this.value}` : null;
    },
  },
};
</script>

<style lang="scss">
</style>
