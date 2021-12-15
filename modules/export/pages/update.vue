<template>
    <div>
        <page-header h1="Редактирование товара" :breadcrumbs="breadcrumbs" />
        <template v-if="exportItem && !$fetchState.pending">
            <v-expansion-panels>
                <form-block title="Основная информация">
                    <export-form :export="exportItem" is-updating @send="updateExport" />
                </form-block>
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
import PageHeader from '~/components/common/PageHeader';
import ExportForm from '~/modules/export/components/ExportForm';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        ExportForm,
        PageHeader,
    },
    data: () => ({
        exportItem: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Список экспортов', to: { name: 'exports.index' } },
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
