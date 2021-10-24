<template>
  <div class="d-flex align-center py-3">
    <div>
      <div class="display-1">{{ h1 }}</div>
      <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    h1: {
      type: String,
      required: true,
    },
    breadcrumbs: {
      type: Array,
      default: () => ([]),
    },
  }
}
</script>
