<template>
  <div class="d-flex flex-column flex-grow-1">

    <div class="d-flex align-center py-3 pb-0">
      <div>
        <div class="display-1">Производители</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>

    <div class="mb-2">
      <v-btn :to="{name: 'brands.create'}">
        Добавить производителя
      </v-btn>
    </div>

    <advanced-search-form
      :filters="filters"
      @search="search"
      :value="searchForm"
    />

    <v-card>
      <v-data-table
        v-model="selectedItems"
        item-key="id"
        :headers="headers"
        :items="brands"
        :loading="isLoading"
        :server-items-length="total"
        loading-text="Идет загрузка..."
        :options.sync="tableOptions"
        :footer-props="tableFooterProps"
        show-select
        @update:items-per-page="updateOptions('itemsPerPage', $event)"
        @update:page="updateOptions('page', $event)"
        @update:sort-by="updateOptions('sortBy', $event)"
        @update:sort-desc="updateOptions('sortDesc', $event)"
      >
        <template v-slot:item.id="{ item }">
          <div class="font-weight-bold"># {{ item.id }}</div>
        </template>

        <template v-slot:item.created_at="{ item }">
          <div>{{ item.asDate('created_at').fromNow() }}</div>
        </template>

        <template v-slot:item.action="{ item }">
          <div class="actions">

            <v-btn icon width="22" height="22" :to="{name: 'brands.update', params: {id: item.id}}">
              <pencil-alt-icon class="h-6 w-6" />
            </v-btn>

            <v-btn icon width="22" height="22" class="mx-1" @click="deleteBrand(item)">
              <trash-icon class="h-6 w-6" />
            </v-btn>

            <v-btn icon width="22" height="22">
              <dots-horizontal-icon class="h-6 w-6" />
            </v-btn>

          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import DatatableMixin from "@/mixins/datatable";
import AdvancedSearchForm from "@/components/search/AdvancedSearchForm";
import { enumToSelectArray, StatusDescription } from "@/enums";
import Brand from "../models/Brand";

export default {
  mixins: [
    DatatableMixin,
  ],
  head: {
    title: 'Производители',
  },
  components: {
    AdvancedSearchForm,
  },
  data() {
    return {
      brands: [],
      searchForm: {
        name: null,
        is_in_home: null,
        status: null,
      },
      headers: [
        { text: 'ID', align: 'left', value: 'id' },
        { text: 'Название', align: 'left', value: 'name' },
        { text: 'Ссылка', align: 'left', value: 'slug' },
        { text: 'Дата создания', align: 'left', value: 'created_at' },
        { text: 'Статус', value: 'status.description', sortable: false },
        { text: 'Страна', value: 'country', sortable: true },
        { text: '', sortable: false, align: 'right', value: 'action' }
      ],
      breadcrumbs: [
        { text: 'Главная', href: '/' },
        { text: 'Список производителей' },
      ],
      filters: [
        {
          label: 'Название',
          name: 'name',
          component: () => import('@/components/search/fields/TextSearchField'),
        },
        {
          label: 'ID',
          name: 'id',
          component: () => import('@/components/search/fields/ComboBoxSearchField'),
        },
        {
          label: 'Ссылка',
          name: 'slug',
          component: () => import('@/components/search/fields/TextSearchField'),
        },
        {
          label: 'Сайт',
          name: 'website',
          component: () => import('@/components/search/fields/TextSearchField'),
        },
        {
          label: 'Страна',
          name: 'country',
          component: () => import('@/components/search/fields/ComboBoxSearchField'),
        },
        {
          label: 'Статус',
          name: 'status',
          component: () => import('@/components/search/fields/SelectSearchField'),
          items: enumToSelectArray(StatusDescription),
        },
        {
          label: 'Отображается на главной',
          name: 'is_in_home',
          component: () => import('@/components/search/fields/BooleanSelectSearchField'),
        },
      ],
    };
  },
  methods: {
    async deleteBrand(brand) {
      if(! await this.$confirm(`Вы действительно хотите удалить производителя ${brand.name}?`)) {
        return;
      }
      try {
        await brand.delete();
        this.$snackbar(`Производитель ${brand.name} успешно удален`);
        this.$fetch();
      }
      catch (e) {
        this.$snackbar(e.message);
      }
    },
  },
  async fetch() {
    this.showLoading();

    const response = await Brand.select({
      brands: ['id','name', 'slug', 'status', 'created_at', 'country']
    })
      .params(this.queryParams)
      .get();

    this.brands = Brand.hydrate(response.data);

    this.setTotal(response.meta.total);
    this.hideLoading();
  },
}
</script>
