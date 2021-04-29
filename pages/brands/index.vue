<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Производители</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>

    <v-text-field v-model="search.name" dense label="Название"></v-text-field>

    <v-text-field v-model="search.status" dense label="Статус"></v-text-field>

    <v-text-field v-model="search.is_in_home" dense label="На главной"></v-text-field>

    <v-card>
      <v-data-table
        v-model="selectedBrands"
        show-select
        :headers="headers"
        :items="brands"
        class="flex-grow-1"
        :loading="isLoading"
        item-key="id"
        :server-items-length="total"
        loading-text="Идет загрузка..."
        :options.sync="options"
        @update:items-per-page="updateOptions('itemsPerPage', $event)"
        @update:page="updateOptions('page', $event)"
        @update:sort-by="updateOptions('sortBy', $event)"
        @update:sort-desc="updateOptions('sortDesc', $event)"
        :footer-props="footerProps"
      >
        <template v-slot:item.id="{ item }">
          <div class="font-weight-bold"># {{ item.id }}</div>
        </template>

        <template v-slot:item.created_at="{ item }">
          <div>{{ item.created_at | formatDate('ll') }}</div>
        </template>

        <template v-slot:item.action="{ item }">
          <div class="actions">

            <v-btn icon width="22" height="22">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </v-btn>

            <v-btn icon width="22" height="22" class="mx-1" @click="openDeleteConfirmation(item.id)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

    <v-dialog
      v-model="deleteConfirmationDialog"
      max-width="340"
    >
      <v-card>

        <v-card-title class="headline text-center">Вы действительно хотите удалить производителя?</v-card-title>

        <v-card-actions>

          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="deleteConfirmationDialog = false"
          >
            Нет
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="deleteBrand(1)"
          >
            Да
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="brandRemovedSnackbar"
      :timeout="2000"
    >
      Производитель успешно удален

      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="brandRemovedSnackbar.value = false"
        >
          Закрыть
        </v-btn>
      </template>
    </v-snackbar>

  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  useFetch,
  useContext,
  useRoute,
  useRouter,
  computed,
  watch
} from '@nuxtjs/composition-api';

import SearchForm from "../../components/search/SearchForm";

export default defineComponent({
  head: {
    title: 'Производители',
  },
  components: {
    SearchForm,
  },
  setup(props, context) {
    const brands = ref([]);
    const selectedBrands = ref([]);
    const { $axios, $confirm, app } = useContext();
    const isLoading = ref(true);
    const deleteConfirmationDialog = ref(false);
    const headers = [
      { text: 'ID', align: 'left', value: 'id' },
      { text: 'Название', align: 'left', value: 'name' },
      { text: 'Статус', value: 'status.description', sortable: false },
      { text: '', sortable: false, align: 'right', value: 'action' }
    ];
    const breadcrumbs = [{
      text: 'Главная',
      disabled: false,
      href: '/'
    }, {
      text: 'Список производителей'
    }];

    const footerProps = {
      'items-per-page-options': [5, 10, 15, 50, 100, 200],
      'items-per-page-text': ""
    };

    const router = useRouter();
    const brandToDelete = ref(null);
    const brandRemovedSnackbar = ref(false);
    const route = useRoute();
    const options = ref({
      itemsPerPage: +route.value.query.per_page || 5,
      page: +route.value.query.page || 1,
      sortBy: [route.value.query.sort_by || "id"].flat(),
      sortDesc: [route.value.query.sort_desc || "true"].flat().map(key => key === 'true'),
    });
    const total = ref(null);


    const search = ref({
      name: route.value.query['filter[name]'],
      is_in_home: route.value.query['filter[is_in_home]'],
      status: route.value.query['filter[status]'],
    });
    const openDeleteConfirmation = (id) => {
      deleteConfirmationDialog.value = true
      brandToDelete.value = id;
    }


    const filter = computed(() => {
      let filters = {};

      Object.keys(search.value).forEach(key => {
        filters[`filter[${key}]`] = search.value[key];
      });

      return filters;
    });

    watch(search.value, () => {
      router.push({
        query : {
          ...route.value.query,
          ...filter.value,
        }
      });
      fetch();
    });

    const deleteBrand = async () => {
      deleteConfirmationDialog.value = false;
      try {
        await $axios.delete(`/admin/brands/${brandToDelete.value}`);
        fetch();
        brandRemovedSnackbar.value = true;
      } catch (e) {
        alert(e.message);
      }
    }

    const sort = computed(() => {
      return options.value.sortBy.map((key, index) => {
        const direction = options.value.sortDesc[index] ? '-' : "";
        return `${direction}${key}`;
      });
    });

    const updateOptions = (key, value) => {
      options.value[key] = value;
      router.push({
        query : {
          ...route.value.query,
          page: options.value.page,
          per_page: options.value.itemsPerPage,
          sort_by: options.value.sortBy,
          sort_desc: options.value.sortDesc,
        }
      });
      fetch();
    }

    const { fetch } = useFetch(async () => {
      isLoading.value = true;
      const response = await $axios.get("/brands", {
        params: {
          "fields[brands]": "id|name|status",
          "page[size]": options.value.itemsPerPage,
          "page[number]": options.value.page,
          'sort': sort.value,
          ...filter.value,
        }
      });
      brands.value = response.data.data;
      total.value = response.data.meta.total;
      isLoading.value = false;
    });

    return {
      brands,
      headers,
      selectedBrands,
      breadcrumbs,
      isLoading,
      deleteConfirmationDialog,
      brandRemovedSnackbar,
      total,
      options,
      sort,
      footerProps,
      search,
      deleteBrand,
      openDeleteConfirmation,
      updateOptions,
    }
  },
});
</script>




