<template>
    <div>
        <page-header h1="Роли" :breadcrumbs="breadcrumbs" />

        <div v-if="$can('create roles')" class="mb-2">
            <v-btn :to="{ name: 'roles.create' }"> Добавить роль </v-btn>
        </div>

        <advanced-search-form fast-filter-name="live" :filters="filters" :value="searchForm" @search="search" />

        <v-card>
            <v-data-table
                v-model="selectedItems"
                item-key="id"
                :headers="headers"
                :items="roles"
                :loading="isLoading"
                :server-items-length="total"
                loading-text="Идет загрузка..."
                :options.sync="tableOptions"
                :footer-props="tableFooterProps"
                @update:items-per-page="updateOptions('itemsPerPage', $event)"
                @update:page="updateOptions('page', $event)"
                @update:sort-by="updateOptions('sortBy', $event)"
                @update:sort-desc="updateOptions('sortDesc', $event)"
            >
                <template #item.id="{ item }">
                    <div class="font-weight-bold"># {{ item.id }}</div>
                </template>

                <template #item.action="{ item }">
                    <div class="table-actions">
                        <v-btn
                            v-if="$can('edit roles')"
                            icon
                            :to="{ name: 'roles.update', params: { id: item.id } }"
                        >
                            <pencil-alt-icon />
                        </v-btn>

                        <v-btn v-if="$can('delete roles')" icon @click.prevent="deleteRole(item)">
                            <trash-icon />
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
import PageHeader from '~/components/common/PageHeader';
import Role from '~/modules/role/models/Role'

export default {
    components: {
        PageHeader,
        AdvancedSearchForm,
    },
    mixins: [DatatableMixin],
    data() {
        return {
            roles: [],
            searchForm: {
                name: null,
            },
            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Название', align: 'left', value: 'name' },
                { text: '', sortable: false, align: 'right', value: 'action' },
            ],
            breadcrumbs: [{ text: 'Список ролей' }],
            filters: [
                {
                    label: 'Название',
                    name: 'name',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'ID',
                    name: 'id',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
            ],
        };
    },
    async fetch() {
        this.showLoading();

        const response = await Role.select({
            roles: ['id', 'name'],
        })
            .params(this.queryParams)
            .get();

        this.roles = Role.hydrate(response.data);

        this.setTotal(response.meta.total);
        this.hideLoading();
    },
    head: {
        title: 'Роли',
    },
    methods: {
        async deleteRole(role) {
            if (!(await this.$confirm(`Вы действительно хотите удалить роль ${role.name}?`))) {
                return;
            }
            try {
                await this.$axios.delete(`/admin/roles/${role.id}`)
                this.$snackbar(`Роль ${role.name} успешно удалена`);
                this.roles = this.roles.filter((item) => item.id !== role.id);
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
