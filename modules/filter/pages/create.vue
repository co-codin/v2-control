<template>
    <div>
        <page-header h1="Добавление фильтра" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <form-block title="Основная информация">
                <filter-form @send="createFilter" />
            </form-block>
        </v-expansion-panels>
    </div>
</template>

<script>
import FilterForm from '../components/FilterForm';
import FormBlock from '~/components/forms/FormBlock';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        PageHeader,
        FormBlock,
        FilterForm,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Список фильтров', to: { name: 'filters.index' }  },
            { text: 'Добавление фильтра' },
        ],
    }),
    head: {
        title: 'Добавление фильтра',
    },
    methods: {
        async createFilter(form) {
            try {
                const { data } = await form.post('/admin/filters');
                this.$snackbar(`Фильтр успешно добавлен`);
                await this.$router.push({ name: 'filters.update', params: { id: data.id } });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании фильта: ${e.message}`);
            }
        },
    },
};
</script>
