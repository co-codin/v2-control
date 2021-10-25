<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex align-center py-3">
            <div>
                <div class="display-1">Добавление фильтра</div>
                <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
            </div>
        </div>

        <v-card class="pa-2">
            <filter-form @send="createFilter">
                <template slot="buttons">
                    <v-btn type="submit">Добавить</v-btn>
                </template>
            </filter-form>
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
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список фильтров', href: '/filters' },
            { text: 'Добавление фильтра' },
        ],
    }),
    head: {
        title: 'Добавление фильтра',
    },
    methods: {
        async createFilter(form) {
            try {
                await form.post('/admin/filters');
                this.$snackbar(`Фильтр ${form.name} успешно добавлен`);
                await this.$router.push({ name: 'filters.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании фильта: ${e.message}`);
            }
        },
    },
};
</script>
