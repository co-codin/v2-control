<template>

  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Производители</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>

    <v-btn :to="{name: 'brands-create'}">Добавить производителя</v-btn>

    <v-text-field v-model="search.name" dense label="Название"></v-text-field>

    <v-text-field v-model="search.status" dense label="Статус"></v-text-field>

    <v-text-field v-model="search.is_in_home" dense label="На главной"></v-text-field>

    <v-card>
      <v-data-table
        v-model="selectedBrands"
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
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </v-btn>

            <v-btn icon width="22" height="22" class="mx-1" @click="deleteBrand(item)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </v-btn>

            <v-btn icon width="22" height="22">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </v-btn>

          </div>
        </template>
      </v-data-table>
    </v-card>

  </div>

</template>

<script>
export default {
  data: () => ({
    brands: [],
    selectedBrands: [],
    search: {
      name: null,
      is_in_home: null,
      status: null,
    },
    total: null,
    headers: [
      { text: 'ID', align: 'left', value: 'id' },
      { text: 'Название', align: 'left', value: 'name' },
      { text: 'Дата создания', align: 'left', value: 'created_at' },
      { text: 'Статус', value: 'status.description', sortable: false },
      { text: '', sortable: false, align: 'right', value: 'action' }
    ],
    isLoading: true,
    breadcrumbs: [
      { text: 'Главная', href: '/' },
      { text: 'Список производителей' },
    ],
    tableFooterProps: {
      'items-per-page-options': [5, 10, 15, 50, 100, 200],
      'items-per-page-text': "",
    },
    tableOptions: {
      itemsPerPage: null,
      page: null,
      sortBy: null,
      sortDesc: null,
    }
  }),
  head: {
    title: 'Производители',
  },
  computed: {
    filter() {
      let filters = {};

      Object.keys(this.search).forEach(key => {
        filters[`filter[${key}]`] = this.search[key];
      });

      return filters;
    },
    sort() {
      return this.tableOptions.sortBy.map((key, index) => {
        const direction = this.tableOptions.sortDesc[index] ? '-' : "";
        return `${direction}${key}`;
      });
    },
  },
  watch: {
    search() {
      this.$router.push({
        query : {
          ...this.$route.query,
          ...this.filter,
        }
      });
      this.$fetch();
    },
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
    updateOptions(key, value) {
      this.tableOptions[key] = value;
      this.$router.push({
        query : {
          ...this.$route.query,
          page: this.tableOptions.page,
          per_page: this.tableOptions.itemsPerPage,
          sort_by: this.tableOptions.sortBy,
          sort_desc: this.tableOptions.sortDesc,
        }
      });
      this.$fetch();
    },
  },
  async fetch() {
    this.isLoading = true;
    const response = await this.$axios.get("/brands", {
      params: {
        "fields[brands]": "id|name|status|created_at",
        "page[size]": this.tableOptions.itemsPerPage,
        "page[number]": this.tableOptions.page,
        'sort': this.sort,
        ...this.filter,
      }
    });
    this.brands = response.data.data;
    this.total = response.data.meta.total;
    this.isLoading = false;
  },
  created() {
    this.tableOptions = {
      itemsPerPage: +this.$route.query.per_page || 5,
      page: +this.$route.query.page || 1,
      sortBy: [this.$route.query.sort_by || "id"].flat(),
      sortDesc: [this.$route.query.sort_desc || "true"].flat().map(key => key === 'true'),
    };
    this.search = {
      name: this.$route.query['filter[name]'],
      is_in_home: this.$route.query['filter[is_in_home]'],
      status: this.$route.query['filter[status]'],
    };
  }
}
</script>
