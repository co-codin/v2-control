<template>
    <div>
        <template v-if="!$fetchState.pending && caseModel">
            <page-header h1="Редактирование кейса" :breadcrumbs="breadcrumbs"/>
            <div class="mb-2">
                <v-btn
                    target="_blank"
                    link
                    :href="`${$config.app.siteUrl}/keysy/${caseModel.slug}`"
                    color="info"
                >
                    <external-link-icon class="h-6 w-6 mr-1" /> Посмотреть на сайте
                </v-btn>
            </div>
            <v-expansion-panels v-model="openedPanel">
                <form-block title="Основная информация">
                    <case-form is-updating :case-item="caseModel" @send="updateCase" />
                </form-block>
                <form-block title="Товары">
                    <case-products-form />
                </form-block>
                <form-block title="Системные галереи">
                    <case-media-form />
                </form-block>
                <form-block title="SEO">
                    <seo-relation-form :seo="caseSeo" @send="updateCaseSeo" />
                </form-block>
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import CaseForm from "~/modules/case/components/CaseForm";
import SeoRelationForm from '~/components/forms/SeoRelationForm';
import PageHeader from '../../../components/common/PageHeader';
import CaseMediaForm from "~/modules/case/components/CaseMediaForm";
import FormBlock from '~/components/forms/FormBlock';
import CaseProductsForm from "~/modules/case/components/CaseProductsForm";
import ExternalLinkIcon from '~/components/heroicons/ExternalLinkIcon';

export default {
    components: {
        CaseMediaForm,
        PageHeader,
        FormBlock,
        CaseForm,
        CaseProductsForm,
        SeoRelationForm,
        ExternalLinkIcon
    },
    data: () => ({
        breadcrumbs: [{ text: 'Список кейсов', to: { name: 'cases.index' } }, { text: 'Редактирование кейса' }],
    }),
    async fetch() {
        await this.getCase(this.$route.params.id);
    },
    head: {
        title: 'Редактирование кейса',
    },
    computed: {
        ...mapGetters({
            caseModel: 'case/case',
            caseSeo: 'case/caseSeo',
        }),
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
        ...mapActions({
            getCase: 'case/getCase',
        }),
        ...mapMutations({
            closeAllPanels: 'helper/closeAllPanels',
            updatePanel: 'helper/updatePanel',
        }),
        async updateCase(form) {
            try {
                await form.put(`/admin/case_models/${this.caseModel.id}`);
                this.$snackbar(`Кейс успешно обновлен`);
                this.closeAllPanels();
            } catch (e) {
                this.$snackbar(`Произошла ошибка при обновлении: ${e.message}`);
            }
        },
        async updateCaseSeo(form) {
            try {
                await form.patch(`/admin/case_models/${this.caseModel.id}/seo`);
                this.$snackbar(`SEO успешно обновлено`);
                this.closeAllPanels();
            } catch (e) {
                this.$snackbar(`Произошла ошибка при обоновлении: ${e.message}`);
            }
        },
    },
};
</script>
