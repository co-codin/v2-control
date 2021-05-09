<template>
  <div class="d-flex flex-column flex-grow-1">

    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Производители</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>

    <v-btn :to="{name: 'brands-create'}">Добавить производителя</v-btn>

    <advanced-search-form
      class="mt-4 mb-4"
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
          <div>{{ item.created_at | formatDate('ll') }}</div>
        </template>

        <template v-slot:item.action="{ item }">
          <div class="actions">

            <v-btn icon width="22" height="22" :to="{name: 'brands-id-update', params: {id: item.id}}">
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
import DatatableMixin from "../../mixins/datatable";
import AdvancedSearchForm from "../../components/search/AdvancedSearchForm";
import TextSearchField from "../../components/search/TextSearchField";
import SelectSearchField from "../../components/search/SelectSearchField";
import BooleanSelectSearchField from "../../components/search/BooleanSelectSearchField";
import AutocompleteSearchField from "../../components/search/AutocompleteSearchField";
import CategoryTreeSearchField from "../../components/search/CategoryTreeSearchField";

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
        { text: 'Дата создания', align: 'left', value: 'created_at' },
        { text: 'Статус', value: 'status.description', sortable: false },
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
          component: TextSearchField
        },
        {
          label: 'Статус',
          name: 'status',
          component: SelectSearchField,
          items: [
            { value: "1", text: 'Отображается на сайте' },
            { value: "2", text: 'Скрыто' },
            { value: "3", text: 'Доступно по URL' },
          ],
        },
        {
          label: 'Отображается на главной',
          name: 'is_in_home',
          component: BooleanSelectSearchField,
        },
        {
          label: 'Категория',
          name: 'category_id',
          component: CategoryTreeSearchField,
        },
        {
          label: 'Производитель',
          name: 'id',
          component: AutocompleteSearchField,
          url: '/brands',
        },
      ],
    };
  },
  computed: {
    enabledFilters() {
      return Object.keys(this.searchForm)
        .filter(key => Boolean(this.searchForm[key]))
        .map(key => {
          return {
            key,
            value: this.searchForm[key],
          }
        });
    }
  },
  methods: {
    async deleteBrand(brand) {
      if(! await this.$confirm(`Вы действительно хотите удалить производителя ${brand.name}?`)) {
        return;
      }
      try {
        await this.$axios.delete(`/admin/brands/${brand.id}`);
        this.$snackbar(`Производитель ${brand.name} успешно удален`);
        this.$fetch();
      }
      catch (e) {
        this.$snackbar(e.message);
      }
    },
    removeChip(attribute) {
      this.searchForm[attribute] = null;
      this.search();
    }
  },
  async fetch() {
    this.showLoading();
    const response = await this.$axios.get("/brands", {
      params: {
        "fields[brands]": "id|name|status|created_at",
        ...this.queryParams,
      },
      // paramsSerializer: params => qs.stringify(params),
    });
    this.brands = response.data.data;
    this.setTotal(response.data.meta.total);
    this.hideLoading();
  },
  created() {

  },
}
</script>
