<template>

  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Редактирование производителя</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>

    <v-card :loading="isLoading" class="mb-3">
      <v-card-title>
        Основная информация
      </v-card-title>
      <v-card-text v-if="brand">
        <brand-form @send="updateBrand" :brand="brand" is-updating />
      </v-card-text>
    </v-card>

    <v-card :loading="isLoading">
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
import SeoRelationForm from "../../../components/SeoRelationForm";

export default {
  head: {
    title: 'Редактирование производителя',
  },
  components: {
    SeoRelationForm,
    BrandForm
  },
  data: () => ({
    brand: null,
    isLoading: true,
    breadcrumbs: [
      { text: 'Главная', disabled: false, href: '/' },
      { text: 'Список производителей', href: '/brands' },
      { text: 'Редактирование производителя' },
    ],
  }),
  async fetch() {
    const { data } = await this.$axios.get('/brands/' + this.$route.params.id, {
      params: {
        include: ['seo'],
      }
    });
    data.data.status = data.data.status.value;
    this.seo = data.data.seo || {};
    this.brand = data.data;
    this.isLoading = false;
  },
  methods: {
    async updateBrand(form) {
      try {
        await form.put(`/admin/brands/${this.$route.params.id}`);
        this.$snackbar(`Производитель успешно обновлен`);
        await this.$router.push({ name: 'brands' });
      }
      catch (e) {
        this.$snackbar('Приозошла ошибка при обновлении производителя: ' + e.message);
      }
    },
    async updateBrandSeo (form) {
      try {
        await form.patch(`/admin/brands/${this.$route.params.id}/seo`);
        this.$snackbar(`SEO производителя успешно обновлено`);
        await this.$router.push({ name: 'brands' });
      }
      catch (e) {
        this.$snackbar('Прозиошла ошибка при обоновлении seo у производителя: ' + e.message);
      }
    },
  }
}
</script>
