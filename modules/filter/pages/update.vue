<template>
    <div>
        <page-header h1="Редактирование фильтра" :breadcrumbs="breadcrumbs" />
        <template v-if="filter && !$fetchState.pending">
            <v-expansion-panels v-model="openedPanel">
                <form-block title="Основная информация">
                    <filter-form :filter="filter" is-updating @send="updateFilter" />
                </form-block>

                <form-block title="Настройки фильтрации">
                    <filter-setting-form :filter="filter" @send="updateFilter" />
                </form-block>

                <form-block title="SEO">
                    <filter-seo-form />
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
import FilterSeoForm from '~/modules/filter/components/FilterSeoForm';

export default {
    components: {
        FilterSeoForm,
        PageHeader,
        FormBlock,
        FilterForm,
        FilterSettingForm,
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
                this.$nuxt.refresh();
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении фильтра: ${e.message}`);
            }
        },
    },
};
</script>
