<template>
  <div>
    главная страница
  </div>
</template>

<script lang="ts">
import { defineComponent, useMeta } from '@nuxtjs/composition-api'

export default defineComponent({
  head: {},
  setup() {
    useMeta({ title: 'My page'});
  },
})
</script>
