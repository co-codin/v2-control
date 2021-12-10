<template>
    <div>
        <template v-if="filter && !$fetchState.pending">
            <page-header
                :h1="`Редактирование фильтра ${filter.name}`"
                :breadcrumbs="breadcrumbs"
            />
            <v-expansion-panels v-model="openedPanel">
                <form-block title="Основная информация">
                    <filter-form :filter="filter" is-updating @send="updateFilter" />
                </form-block>
                <form-block title="Настройки фильтрации">
                    <filter-facet-form :filter="filter" @save="filter = $event" />
                </form-block>
                <form-block title="SEO">
                    <filter-seo-form :filter="filter" @save="filter = $event" />
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
import FilterFacetForm from '~/modules/filter/components/FilterFacetForm';
import FilterSeoForm from '~/modules/filter/components/FilterSeoForm';
import Filter from "~/modules/filter/models/Filter";
import {merge} from 'lodash';

export default {
    components: {
        FilterSeoForm,
        PageHeader,
        FormBlock,
        FilterForm,
        FilterFacetForm,
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
        const filter = await Filter.$find(this.$route.params.id);
        filter.options = merge({
            seoPrefix: null,
            seoTagLabel: null,
            seoTagLabels: null,
        }, filter.options || {});
        this.filter = filter;
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
    created() {},
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
