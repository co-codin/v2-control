<template>
  <div>
    <v-combobox
      :label="label"
      multiple
      @change="updateInput($event)"
      dense
      :value="value"
      hide-details
    />
    <portal
      v-if="Boolean(value.length)"
      :to="`filter-${name}-chips`"
    >
      <div>
        <v-chip v-for="(item, index) in value" :key="index" close @click:close="removeMultipleChip(index)">
          {{ label }}: {{ item }}
        </v-chip>
      </div>
    </portal>
  </div>
</template>

<script>
import { debounce } from "lodash";

export default {
  props: {
    value: {
      default: () => ([]),
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
  methods: {
    removeMultipleChip(index) {
      const currentValue = [ ...this.value ]
      currentValue.splice(index, 1);
      this.$emit('input', currentValue);
    },
    updateInput: debounce(function(value) {
      this.$emit('input', value);
    }, 300),
  },
}
</script>
