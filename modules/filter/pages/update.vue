<template>
    <div>
        <page-header h1="Редактирование фильтра" :breadcrumbs="breadcrumbs" />
        <template v-if="filter && !$fetchState.pending">
            <v-expansion-panels v-model="openedPanel">
                <form-block title="Основная информация">
                    <filter-form :filter="filter" is-updating @send="updateFilter" />
                </form-block>

                <form-block title="Настройки фильтрации">
                    <filter-setting-form :filter="filter" />
                </form-block>

                <form-block title="SEO">
                    <seo-relation-form :seo="filterSeo" @send="updateFilterSeo" />
                </form-block>
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';
import FilterForm from '../components/FilterForm';
import FormBlock from '~/components/forms/FormBlock';
import PageHeader from '~/components/common/PageHeader';
import FilterSettingForm from '~/modules/filter/components/FilterSettingForm';
import SeoRelationForm from '~/components/forms/SeoRelationForm';

export default {
    components: {
        SeoRelationForm,
        PageHeader,
        FormBlock,
        FilterForm,
        FilterSettingForm,
    },
    data: () => ({
        filter: null,
        filterSeo: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список фильтров', href: '/filters' },
            { text: 'Редактирование фильтра' },
        ],
    }),
    async fetch() {
        const { data } = await this.$axios.get(`/filters/${this.$route.params.id}`, {
            params: {
                include: ['seo'],
            },
        });
        this.filter = data.data;
        this.filterSeo = data.data.seo || {};
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование фильтра',
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
        async updateFilter(form) {
            try {
                await form.put(`/admin/filters/${this.$route.params.id}`);
                this.$snackbar(`Фильтр успешно обновлен`);
                this.closeAllPanels();
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении фильтра: ${e.message}`);
            }
        },
        async updateFilterSeo(form) {
            try {
                await form.patch(`/admin/filters/${this.filter.id}/seo`);
                this.$snackbar(`SEO фильтра успешно обновлено`);
                this.closeAllPanels();
            } catch (e) {
                this.$snackbar(`Произошла ошибка при обоновлении seo у фильтра: ${e.message}`);
            }
        },
    },
};
</script>
