<template>
    <div>
        <page-header h1="Атрибуты" :breadcrumbs="breadcrumbs" />

        <div class="mb-2">
            <v-btn :to="{ name: 'attributes.create' }"> Добавить атрибут </v-btn>
        </div>

        <advanced-search-form :filters="filters" :value="searchForm" @search="search" />

        <v-card>
            <v-data-table
                v-model="selectedItems"
                item-key="id"
                :headers="headers"
                :items="attributes"
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
                <template #item.id="{ item }">
                    <div class="font-weight-bold"># {{ item.id }}</div>
                </template>

                <template #item.is_default="{ item }">
                    <div class="font-weight-bold">{{ item.is_default ? 'Да' : 'Нет' }}</div>
                </template>

                <template #item.action="{ item }">
                    <div class="actions">
                        <v-btn icon width="22" height="22" :to="{ name: 'attributes.update', params: { id: item.id } }">
                            <pencil-alt-icon class="h-6 w-6" />
                        </v-btn>

                        <v-btn icon width="22" height="22" class="mx-1" @click.prevent="deleteAttribute(item)">
                            <trash-icon class="h-6 w-6" />
                        </v-btn>
                    </div>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script>
import DatatableMixin from '@/mixins/datatable';
import AdvancedSearchForm from '@/components/search/AdvancedSearchForm';
import Attribute from '~/modules/attribute/models/Attribute';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        PageHeader,
        AdvancedSearchForm,
    },
    mixins: [DatatableMixin],
    data() {
        return {
            attributes: [],
            searchForm: {
                name: null,
                is_default: null,
            },
            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Название', align: 'left', value: 'name' },
                { text: 'По умолчанию', align: 'left', value: 'is_default' },
                { text: '', sortable: false, align: 'right', value: 'action' },
            ],
            breadcrumbs: [{ text: 'Главная', href: '/' }, { text: 'Список атрибутов' }],
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
                    label: 'Статус',
                    name: 'is_enabled',
                    component: () => import('@/components/search/fields/SelectSearchField'),
                },
                {
                    label: 'По умолчанию',
                    name: 'is_default',
                    component: () => import('@/components/search/fields/BooleanSelectSearchField'),
                },
            ],
        };
    },
    async fetch() {
        this.showLoading();

        const response = await Attribute.select({
            attributes: ['id', 'name', 'is_default'],
        })
            .params(this.queryParams)
            .get();

        this.attributes = Attribute.hydrate(response.data);

        this.setTotal(response.meta.total);
        this.hideLoading();
    },
    head: {
        title: 'Атрибуты',
    },
    methods: {
        async deleteAttribute(attribute) {
            if (!(await this.$confirm(`Вы действительно хотите удалить атрибута ${attribute.name}?`))) {
                return;
            }
            try {
                await attribute.delete();

                this.$snackbar(`Атрибут ${attribute.name} успешно удален`);
                this.attributes = this.attributes.filter((item) => item.id !== attribute.id);
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
