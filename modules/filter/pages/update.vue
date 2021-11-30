<template>
    <div>
        <page-header h1="Редактирование фильтра" :breadcrumbs="breadcrumbs" />
        <template v-if="filter && !$fetchState.pending">
            <v-expansion-panels>
                <form-block title="Основная информация">
                    <filter-form :filter="filter" is-updating @send="updateFilter" />
                </form-block>
            </v-expansion-panels>
        </template>
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
