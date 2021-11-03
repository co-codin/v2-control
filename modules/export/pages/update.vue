<template>
    <div>
        <page-header h1="Редактирование экспорта" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels v-if="exportItem">
            <export-form :export="exportItem" is-updating @send="updateExport" />
        </v-expansion-panels>
    </div>
</template>

<script>
import PageHeader from '~/components/common/PageHeader';
import ExportForm from '~/modules/export/components/ExportForm';

export default {
    components: {
        ExportForm,
        PageHeader,
    },
    data: () => ({
        exportItem: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список экспортов', href: '/exports' },
            { text: 'Редактирование экспорта' },
        ],
    }),
    async fetch() {
        const { data } = await this.$axios.get(`/exports/${this.$route.params.id}`);
        this.exportItem = data.data;
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование экспорта',
    },
    methods: {
        async updateExport(form) {
            try {
                await form.put(`/admin/exports/${this.$route.params.id}`);
                this.$snackbar(`Экспорт успешно обновлен`);
                await this.$router.push({ name: 'exports.index' });
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении экспорта: ${e.message}`);
            }
        },
    },
};
</script>
