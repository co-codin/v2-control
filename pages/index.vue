<template>
  <div>
    <v-btn @click="deleteBrand(1)">открыть confirm</v-btn>
  </div>
</template>


<script>
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  setup(props, context) {
    const deleteBrand = async (brand_id) => {
      if(await context.root.$confirm('Уверены?')) {
        context.root.$snackbar('Производитель успешно удален');
      }
    }

    return {
      deleteBrand,
    }
  },
});
</script>
