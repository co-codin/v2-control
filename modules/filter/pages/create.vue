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
