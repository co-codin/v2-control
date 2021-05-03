<template>

  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Добавление производителя</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>

    <v-card class="pa-2">
      <brand-form @send="createBrand">
        <template slot="buttons">
          <v-btn type="submit">Добавить</v-btn>
        </template>
      </brand-form>
    </v-card>

  </div>

</template>


<script>
import BrandForm from "../../components/BrandForm";

import {
  defineComponent,
  useRouter,
} from '@nuxtjs/composition-api';

export default defineComponent({
  head: {
    title: 'Добавление производителя',
  },
  components: {
    BrandForm
  },
  setup() {
    const breadcrumbs = [
      { text: 'Главная', disabled: false, href: '/' },
      { text: 'Список производителей', href: '/brands' },
      { text: 'Добавление производителя' },
    ];
    const router = useRouter();

    async function createBrand(form) {
      await form.post("/admin/brands");
      router.push('/brands');
    }

    return { breadcrumbs, createBrand }
  },
});
</script>
