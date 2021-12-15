<template>
    <div>
        <page-header h1="Фильтры" :breadcrumbs="breadcrumbs"></page-header>
        <category-tree-search-field
            label="Категория"
            name="categoryIds"
            :value="category"
            @input="changeCategory"
            :multiple="false"
        />
        <v-alert v-if="!category" type="info" dense class="mt-2">
            Выберите категорию для сортировки фильтров
        </v-alert>
        <v-alert v-else-if="!loading && !filters.length" type="info" dense class="mt-2">
            В выбранной категории нет фильтров
        </v-alert>
        <div v-else class="mt-2">
            <v-simple-table class="elevation-3">
                <template v-slot:default>
                    <draggable tag="tbody" @update="update" v-model="filters">
                        <tr v-for="filter in filters" :key="filter.id">
                            <td>{{ filter.name }}</td>
                        </tr>
                    </draggable>
                </template>
            </v-simple-table>
        </div>
    </div>
</template>

<script>
import PageHeader from "~/components/common/PageHeader";
import Filter from "@/modules/filter/models/Filter";
import CategoryTreeSearchField from "~/components/search/fields/CategoryTreeSearchField";
import draggable from "vuedraggable";

export default {
    components: {
        PageHeader,
        CategoryTreeSearchField,
        draggable,
    },
    data() {
        return {
            category: null,
            filters: [],
            loading: false,
            breadcrumbs: [
                { text: 'Список фильтров', to: { name: 'filters.index' } },
                { text: 'Сортировка' },
            ],
        };
    },
    computed: {
        filterIds() {
            return this.filters.map(filter => filter.id);
        },
    },
    created() {
        if(this.$route.query.category) {
            this.changeCategory(this.$route.query.category);
        }
    },
    methods: {
        async changeCategory(category) {
            this.loading = true;
            this.category = category;
            this.filters = await Filter.select('id', 'name')
                .where('category_id', category)
                .orderBy('position')
                .params({
                    'page[size]': 100,
                })
                .$get();
            this.loading = false;
        },
        async update() {
            try {
                let position = 0;
                await this.$axios.post(`/admin/filters/sort`, {
                    filters: this.filters.map(filter => ({
                        id: filter.id,
                        position: ++position,
                    })),
                });
                this.$snackbar(`Позиции фильтров успешно сохранены`);
            }
            catch (e) {
                this.$snackbar(`Произошла ошибка при сохранении: ${e.message}`);
            }
        },
    },
};
</script>
