<template>
    <div>
        <page-header h1="Добавление кабинета" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <form-block title="Основная информация">
                <cabinet-form @send="createCabinet" />
            </form-block>
        </v-expansion-panels>
    </div>
</template>

<script>
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';
import CabinetForm from '~/modules/cabinet/components/CabinetForm';

export default {
    components: {
        CabinetForm,
        FormBlock,
        PageHeader,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список кабинетов', href: '/cabinets' },
            { text: 'Добавление кабинетов' },
        ],
    }),
    head: {
        title: 'Добавление кабинетов',
    },
    methods: {
        async createCabinet(form) {
            try {
                await form.post('/admin/cabinets');
                this.$snackbar(`Кабинет ${form.name} успешно добавлен`);
                await this.$router.push({ name: 'cabinets.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании кабинета: ${e.message}`);
            }
        },
    },
};
</script>
