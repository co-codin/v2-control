<template>
    <div>
        <page-header h1="Добавление экспорта" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <export-form @send="createExport" />
        </v-expansion-panels>
    </div>
</template>

<script>
import ExportForm from '../components/ExportForm';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        ExportForm,
        PageHeader,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список экспортов', href: '/exports' },
            { text: 'Добавление экспорта' },
        ],
    }),
    head: {
        title: 'Добавление экспорта',
    },
    methods: {
        async createExport(form) {
            try {
                await form.post('/admin/exports');
                this.$snackbar(`Экспорт ${form.name} успешно добавлен`);
                await this.$router.push({ name: 'exports.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании экспорта: ${e.message}`);
            }
        },
    },
};
</script>
