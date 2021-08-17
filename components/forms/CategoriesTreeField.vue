<template>
  <v-input :label="label">
    <treeselect
      @input="$emit('input', $event)"
      :value="value"
      :multiple="multiple"
      :options="options"
      :normalizer="normalizer"
    />
  </v-input>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { toTree, fetchAllEntries } from "@/helpers";

export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      default: null,
    },
    multiple: {
      type: Boolean,
      default: true,
    }
  },
  components: {
    Treeselect,
  },
  data() {
    return {
      categories: [],
    }
  },
  computed: {
    options() {
      return toTree(this.categories);
    },
  },
  methods: {
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children && node.children.length
          ? node.children
          : undefined,
      }
    },
  },
  async created() {
    this.categories = await fetchAllEntries(page => {
      return this.$axios.get("/categories", {
        params: {
          "page[size]": 100,
          "page[number]": page,
          "fields[categories]": "id,name,parent_id",
          "sort": "name",
        }
      });
    });
  }
}
</script>

<style>

</style>
