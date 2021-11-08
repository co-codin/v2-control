<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex align-center py-3 pb-0">
            <div>
                <div class="display-1">Достижения</div>
                <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
            </div>
        </div>

        <div class="mb-2">
            <v-btn :to="{ name: 'achievements.create' }"> Добавить достижения </v-btn>
        </div>

        <advanced-search-form :filters="filters" :value="searchForm" @search="search" />

        <v-card>
            <v-data-table
                v-model="selectedItems"
                item-key="id"
                :headers="headers"
                :items="achievements"
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

                <template #item.is_enabled="{ item }">
                    <div class="font-weight-bold">{{ item.is_enabled ? 'Да' : 'Нет' }}</div>
                </template>

                <template #item.created_at="{ item }">
                    <div>{{ item.asDate('created_at').fromNow() }}</div>
                </template>

                <template #item.action="{ item }">
                    <div class="actions">
                        <v-btn
                            icon
                            width="22"
                            height="22"
                            :to="{ name: 'achievements.update', params: { id: item.id } }"
                        >
                            <pencil-alt-icon class="h-6 w-6" />
                        </v-btn>

                        <v-btn icon width="22" height="22" class="mx-1" @click.prevent="deleteAchievement(item)">
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
import DatatableMixin from '@/mixins/datatable';
import AdvancedSearchForm from '@/components/search/AdvancedSearchForm';
import { enumToSelectArray, statusDescriptions } from '@/enums';
import Achievement from '~/modules/achievement/models/Achievement';

export default {
    components: {
        AdvancedSearchForm,
    },
    mixins: [DatatableMixin],
    data() {
        return {
            achievements: [],
            searchForm: {
                name: null,
                is_enabled: null,
            },
            headers: [
                { text: 'ID', align: 'left', value: 'id' },
                { text: 'Название', align: 'left', value: 'name' },
                { text: 'Картинка', align: 'left', value: 'image', sortable: false },
                { text: 'Доступно', value: 'is_enabled' },
                { text: 'Дата создания', align: 'left', value: 'created_at' },
                { text: 'Позиция', align: 'left', value: 'position' },
                { text: '', sortable: false, align: 'right', value: 'action' },
            ],
            breadcrumbs: [{ text: 'Главная', href: '/' }, { text: 'Список достижений' }],
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
                    items: enumToSelectArray(statusDescriptions),
                },
            ],
        };
    },
    async fetch() {
        this.showLoading();

        const response = await Achievement.select({
            achievements: ['id', 'name', 'image', 'is_enabled', 'position', 'created_at'],
        })
            .params(this.queryParams)
            .get();

        this.achievements = Achievement.hydrate(response.data);

        this.setTotal(response.meta.total);
        this.hideLoading();
    },
    head: {
        title: 'Достижения',
    },
    methods: {
        async deleteAchievement(achievement) {
            if (!(await this.$confirm(`Вы действительно хотите удалить достижения ${achievement.name}?`))) {
                return;
            }
            try {
                await achievement.delete();

                this.$snackbar(`Достижение ${achievement.name} успешно удален`);
                this.achievements = this.achievements.filter((item) => item.id !== achievement.id);
            } catch (e) {
                this.$snackbar(e.message);
            }
        },
    },
};
</script>
