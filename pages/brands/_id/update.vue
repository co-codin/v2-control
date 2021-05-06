<template>

  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Редактирование производителя</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>

    <v-card :loading="loading" class="mb-3">
      <v-card-title>
        Основная информация
      </v-card-title>
      <v-card-text v-if="brand">
        <brand-form @send="updateBrand" :brand="brand" is-updating />
      </v-card-text>
    </v-card>

    <v-card :loading="loading">
      <v-card-title>
        SEO
      </v-card-title>
      <v-card-text v-if="brand">
        <seo-relation-form @send="updateBrandSeo" :seo="seo" />
      </v-card-text>
    </v-card>

  </div>

</template>


<script>
import BrandForm from "../../../components/BrandForm";

import {
  defineComponent,
  ref,
  useContext,
  useFetch,
  useRoute,
  useRouter,
} from '@nuxtjs/composition-api';
import SeoRelationForm from "../../../components/SeoRelationForm";

export default defineComponent({
  head: {
    title: 'Редактирование производителя',
  },
  components: {
    SeoRelationForm,
    BrandForm
  },
  setup(props, { root }) {
    const breadcrumbs = [
      { text: 'Главная', disabled: false, href: '/' },
      { text: 'Список производителей', href: '/brands' },
      { text: 'Редактирование производителя' },
    ];

    const route = useRoute();
    const router = useRouter();
    const brand = ref(null);
    const seo = ref(null);
    const loading = ref(true);
    const { $axios } = useContext();

    useFetch(async () => {
      const { data } = await $axios.get('/brands/' + route.value.params.id, {
        params: {
          include: ['seo'],
        }
      });
      data.data.status = data.data.status.value;
      seo.value = data.data.seo || {};
      brand.value = data.data;
      loading.value = false;
    });

    const updateBrand = async (form) => {
      try {
        await form.put(`/admin/brands/${route.value.params.id}`);
        root.$snackbar(`Производитель успешно обновлен`);
        router.push({ name: 'brands' });
      }
      catch (e) {
        root.$snackbar('Приозошла ошибка при обновлении производителя: ' + e.message);
      }
    }

    const updateBrandSeo = async (form) => {
      try {
        await form.patch(`/admin/brands/${route.value.params.id}/seo`);
        root.$snackbar(`SEO производителя успешно обновлено`);
        router.push({ name: 'brands' });
      }
      catch (e) {
        root.$snackbar('Прозиошла ошибка при обоновлении seo у производителя: ' + e.message);
      }
    }

    return { loading, brand, seo, breadcrumbs, updateBrand, updateBrandSeo }
  },
});
</script>
