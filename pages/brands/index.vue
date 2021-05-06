<template>
  <div>
    <table>
      <tr>
        <th v-for="header in headers" :key="header">{{ header }}</th>
      </tr>
      <tr v-for="brand in brands" :key="brand.id">
        <td>{{ brand.name }}</td>
        <td>{{ brand.slug }}</td>
        <td>{{ brand.is_in_home.label }}</td>
        <td>{{ brand.country }}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, useFetch, useContext, ref } from "@nuxtjs/composition-api";
import Brand from "~/models/Brand";

export default defineComponent({
  setup() {
    const {$axios} = useContext();
    const brands = ref();
    const headers = ['Название', 'Ссылка', 'На главной', 'Страна'];

    useFetch(async () => {
      const response = await $axios.get('/brands?fields[brands]=id|name|slug|country|is_in_home');
      brands.value = Brand.hydrate(response.data.data);
    });

    return { brands,  headers };
  },
});
</script>
