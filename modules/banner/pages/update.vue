<template>
    <div>
        <page-header h1="Редактирование производителя" :breadcrumbs="breadcrumbs" />
        <template v-if="!$fetchState.pending">
            <v-expansion-panels>
                <form-block title="Основная информация">
                    <banner-form :banner="banner" is-updating @send="updateBanner" />
                </form-block>
            </v-expansion-panels>
        </template>
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
        banner: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Список баннеров', to: { name: 'banners.index' } },
            { text: 'Редактирование баннера' },
        ],
    }),
    async fetch() {
        const { data } = await this.$axios.get(`/banners/${this.$route.params.id}`);
        this.banner = data.data;
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование баннера',
    },
    methods: {
        async updateBanner(form) {
            try {
                await form.put(`/admin/banners/${this.$route.params.id}`);
                this.$snackbar(`Баннер успешно обновлен`);
                await this.$router.push({ name: 'banners.index' });
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении баннера: ${e.message}`);
            }
        }
    },
};
</script>
