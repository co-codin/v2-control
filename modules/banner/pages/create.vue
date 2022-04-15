<template>
    <div>
        <page-header h1="Добавление баннера" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <form-block title="Основная информация">
                <banner-form @send="createBanner" />
            </form-block>
        </v-expansion-panels>
    </div>
</template>

<script>
import BannerForm from '../components/BannerForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        PageHeader,
        BannerForm,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Список баннеров', to: { name: 'banners.index' } },
            { text: 'Добавление баннера' },
        ],
    }),
    head: {
        title: 'Добавление баннера',
    },
    methods: {
        async createBanner(form) {
            try {
                await form.post('/admin/banners');
                this.$snackbar(`Баннер ${form.name} успешно добавлен`);
                await this.$router.push({ name: 'banners.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании баннера: ${e.message}`);
            }
        },
    },
};
</script>
