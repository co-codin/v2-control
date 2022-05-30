<template>
    <div>
        <page-header h1="Города" :breadcrumbs="breadcrumbs" />

        <div class="mb-2">
            <v-btn :to="{ name: 'contacts.create' }"> Добавить контакт </v-btn>
        </div>

        <advanced-search-form :filters="filters" :value="searchForm" @search="search" />

        <v-card>
            <v-data-table
                v-model="selectedItems"
                item-key="id"
                :headers="headers"
                :items="contacts"
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

                <template #item.created_at="{ item }">
                    <div>{{ item.asDate('created_at').fromNow() }}</div>
                </template>

                <template #item.coordinate="{ item }">
                    <span v-if="item.coordinate"> {{ item.coordinate.lat }} : {{ item.coordinate.long }} </span>
                </template>

                <template #item.is_default="{ item }">
                    <span> {{ item.is_default ? 'Да' : 'Нет' }} </span>
                </template>

                <template #item.action="{ item }">
                    <div class="table-actions">
                        <v-btn icon :to="{ name: 'contacts.update', params: { id: item.id } }">
                            <pencil-alt-icon />
                        </v-btn>

                        <v-btn icon @click="deleteContact(item)">
                            <trash-icon />
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
import DatatableMixin from '@/mixins/datatable';
import AdvancedSearchForm from '@/components/search/AdvancedSearchForm';
import { statusLabels } from '@/enums';
import Contact from '../models/Contact';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        PageHeader,
        AdvancedSearchForm,
    },
    mixins: [DatatableMixin],
    data() {
        return {
            contacts: [],
            searchForm: {
                name: null,
                status: null,
            },
            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Имя', align: 'left', value: 'first_name' },
                { text: 'Фамилия', align: 'left', value: 'last_name' },
                { text: 'Доступно', value: 'is_enabled' },
                { text: 'email', value: 'email', sortable: false },
                { text: 'Дата создания', align: 'left', value: 'created_at' },
                { text: '', sortable: false, align: 'right', value: 'action' },
            ],
            breadcrumbs: [{ text: 'Список контактов' }],
            filters: [
                {
                    label: 'Фамилия',
                    name: 'last_name',
                    component: () => import('@/components/search/fields/TextSearchField'),
                },
                {
                    label: 'ID',
                    name: 'id',
                    component: () => import('@/components/search/fields/TextSearchField'),
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

        const response = await Contact.select({
            contacts: [
                'id', 'first_name', 'last_name', 'job_position', 'email', 'is_enabled', 'created_at'
            ],
        })
            .params(this.queryParams)
            .get();

        this.cities = Contact.hydrate(response.data);

        this.setTotal(response.meta.total);
        this.hideLoading();
    },
    head: {
        title: 'Контакты',
    },
    methods: {
        async deleteContact(contact) {
            if (!(await this.$confirm(`Вы действительно хотите удалить контактк ${contact.last_name}?`))) {
                return;
            }
            try {
                await contact.delete();

                this.$snackbar(`Контакт ${contact.last_name} успешно удален`);

                this.contacts = this.contacts.filter((item) => item.id !== contact.id);
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
