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

export default {
  head: {
    title: 'Добавление производителя',
  },
  components: {
    BrandForm
  },
  data: () => ({
    breadcrumbs: [
      { text: 'Главная', disabled: false, href: '/' },
      { text: 'Список производителей', href: '/brands' },
      { text: 'Добавление производителя' },
    ],
  }),
  methods: {
    async createBrand(form) {
      try {
        const brand_name = form.name;
        await form.post('/admin/brands');
        this.$snackbar(`Производитель ${brand_name} успешно добавлен`)
        await this.$router.push('/brands');
      }
      catch (e) {
        this.$snackbar(`Произошла ошибка при создании производителя: ${e.message}`)
      }
    },
  },
}
</script>
