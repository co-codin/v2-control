<template>
    <div>
        <page-header h1="Пользователи" :breadcrumbs="breadcrumbs" />

        <div v-if="$can('create users')" class="mb-2">
            <v-btn :to="{ name: 'users.create' }"> Добавить пользователя </v-btn>
        </div>

        <advanced-search-form fast-filter-name="live" :filters="filters" :value="searchForm" @search="search" />

        <v-card>
            <v-data-table
                disable-sort
                v-model="selectedItems"
                item-key="id"
                :headers="headers"
                :items="users"
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
                    <div class="font-weight-bold text-no-wrap"># {{ item.id }}</div>
                </template>

                <template #item.roles="{ item }">
                    <ul class="pa-0">
                        <li v-for="role in item.roles" :key="role.id">{{ role.name }}</li>
                    </ul>
                </template>

                <template #item.action="{ item }">
                    <div class="table-actions">
                        <v-btn
                            v-if="$can('edit users')"
                            icon
                            width="22"
                            height="22"
                            class="mx-1"
                            :to="{ name: 'users.update', params: { id: item.id } }"
                        >
                            <pencil-alt-icon />
                        </v-btn>
                        <v-btn v-if="$can('delete users')" icon @click.prevent="deleteUser(item)">
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
import User from "~/modules/user/models/User";
import PageHeader from '~/components/common/PageHeader';
import CopyLabel from '~/components/common/CopyLabel';

export default {
    components: {
        AdvancedSearchForm,
        PageHeader,
        CopyLabel,
    },
    mixins: [DatatableMixin],
    data() {
        return {
            users: [],
            searchForm: {
                live: null,
                name: null,
                email: null
            },
            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Имя', align: 'left', value: 'name' },
                { text: 'E-mail', align: 'left', value: 'email' },
                { text: 'Роли', align: 'left', value: 'roles' },
                { text: '', sortable: false, align: 'right', value: 'action' },
            ],
            breadcrumbs: [{ text: 'Список пользователей' }],
            filters: [
                {
                    label: 'Быстрый поиск',
                    name: 'live',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'Имя',
                    name: 'name',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'E-mail',
                    name: 'email',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
            ],
        };
    },
    async fetch() {
        this.showLoading();
        const response = await User.params(this.queryParams).include('roles').get();
        this.users = User.hydrate(response.data);
        this.setTotal(response.meta.total);
        this.hideLoading();
    },
    head: {
        title: 'Пользователи',
    },
    methods: {
        async deleteUser(user) {
            if (!(await this.$confirm(`Вы действительно хотите удалить ${user.name}?`))) {
                return;
            }
            try {
                await user.delete();
                this.$snackbar(`Пользователь ${user.name} успешно удален`);
                this.users = this.users.filter((item) => item.id !== user.id);
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
