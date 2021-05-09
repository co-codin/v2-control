<template>
  <div>
    <v-input :label="label">
      <treeselect
        @change="$emit('input', $event)"
        :value="value"
        :multiple="multiple"
        :options="entries"
        :normalizer="normalizer"
      />
    </v-input>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    value: {
      default: null,
    },
    perPage: {
      type: Number,
      default: 15,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    Treeselect,
  },
  data() {
    return {
      entries: [],
    }
  },
  computed: {
    options() {
      return [
        { id: 1, label: 'Label' },
      ]
    }
  },
  methods: {
    loadItems(page) {
      return this.$axios.get(this.url, {
        params: {
          "page[size]": this.perPage,
          "page[number]": page,
          "fields[categories]": "id|name",
        }
      });
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
      }
    },
  },
  async created() {
    let page = 1;
    let response = await this.loadItems();
    this.entries = this.entries.concat(response.data.data);
    while (response.data.meta.current_page < response.data.meta.last_page) {
      response = await this.loadItems(++page);
      this.entries = this.entries.concat(response.data.data);
    }
  }
}
</script>
