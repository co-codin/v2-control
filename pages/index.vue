<template>
  <div>
    <v-btn @click="openConfirm">открыть confirm</v-btn>
  </div>
</template>


<script>
import { defineComponent, useContext } from '@nuxtjs/composition-api';

export default defineComponent({
  setup(props, context) {

    //const { $tooltip } = useContext();

    const openConfirm = () => {
      context.$confirm('sasasas');
    };

    return { openConfirm }
  },
});
</script>
