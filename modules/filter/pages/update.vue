<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex align-center py-3">
            <div>
                <div class="display-1">Редактирование фильтра</div>
                <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
            </div>
        </div>

        <v-card :loading="isLoading" class="mb-3">
            <v-card-title> Основная информация </v-card-title>
            <v-card-text v-if="filter">
                <filter-form :filter="filter" is-updating @send="updateFilter" />
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import FilterForm from '../components/FilterForm';

export default {
    components: {
        FilterForm,
    },
    data: () => ({
        filter: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список фильтров', href: '/filters' },
            { text: 'Редактирование фильтра' },
        ],
    }),
    async fetch() {
        const { data } = await this.$axios.get(`/filters/${this.$route.params.id}`);
        this.filter = data.data;
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование фильтра',
    },
    methods: {
        async updateFilter(form) {
            try {
                await form.put(`/admin/filters/${this.$route.params.id}`);
                this.$snackbar(`Фильтр успешно обновлен`);
                await this.$router.push({ name: 'filters.index' });
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении фильтра: ${e.message}`);
            }
        },
    },
};
</script>
