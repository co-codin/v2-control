<template>
    <div>
        <page-header h1="Редактирование экспорта" :breadcrumbs="breadcrumbs" />
        <template v-if="exportItem && !$fetchState.pending">
            <v-expansion-panels v-model="openedPanel">
                <form-block title="Основная информация">
                    <export-form :export="exportItem" is-updating @send="updateExport" />
                </form-block>

                <form-block title="Настройка выборки">
                    <export-setting-form @send="updateExport" />
                </form-block>
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';
import PageHeader from '~/components/common/PageHeader';
import ExportForm from '~/modules/export/components/ExportForm';
import FormBlock from '~/components/forms/FormBlock';
import ExportSettingForm from '~/modules/export/components/ExportSettingForm';

export default {
    components: {
        ExportSettingForm,
        FormBlock,
        ExportForm,
        PageHeader,
    },
    data: () => ({
        exportItem: null,
        isLoading: true,
        breadcrumbs: [{ text: 'Список экспортов', to: { name: 'exports.index' } }, { text: 'Редактирование экспорта' }],
    }),
    async fetch() {
        const { data } = await this.$axios.get(`/exports/${this.$route.params.id}`);
        this.exportItem = data.data;
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование экспорта',
    },
    computed: {
        openedPanel: {
            get() {
                return this.$store.state.helper.openedPanel;
            },
            set(index) {
                this.closeAllPanels();
                this.updatePanel(index);
            },
        },
    },
    methods: {
        ...mapMutations({
            closeAllPanels: 'helper/closeAllPanels',
            updatePanel: 'helper/updatePanel',
        }),
        async updateExport(form) {
            try {
                await form.put(`/admin/exports/${this.$route.params.id}`);
                this.$snackbar(`Экспорт успешно обновлен`);
                await this.$router.push({ name: 'exports.index' });
                this.closeAllPanels();
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении экспорта: ${e.message}`);
            }
        },
    },
};
</script>
