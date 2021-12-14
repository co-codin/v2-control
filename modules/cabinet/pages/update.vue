<template>
    <div>
        <page-header h1="Редактирование кабинета" :breadcrumbs="breadcrumbs" />
        <div class="mb-2">
            <v-btn target="_blank" link :href="``" color="info" dark>
                <external-link-icon class="h-6 w-6 mr-1" /> Посмотреть на сайте
            </v-btn>
        </div>
        <template v-if="!$fetchState.pending">
            <v-expansion-panels v-model="openedPanel">
                <form-block title="Основная информация">
                    <cabinet-form is-updating />
                </form-block>
                <form-block title="Оснащение">
                    <cabinet-categories-form />
                </form-block>
                <!--                <form-block title="Документы">-->
                <!--                    <cabinet-documents-form />-->
                <!--                </form-block>-->
                <form-block title="Требования">
                    <cabinet-requirements-form />
                </form-block>
                <form-block title="SEO">
                    <seo-relation-form :seo="cabinetSeo" @send="updateCabinetSeo" />
                </form-block>
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import ExternalLinkIcon from '~/components/heroicons/ExternalLinkIcon';
import SeoRelationForm from '@/components/forms/SeoRelationForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';
import CabinetForm from '~/modules/cabinet/components/CabinetForm';
import CabinetDocumentsForm from '~/modules/cabinet/components/CabinetDocumentsForm';
import CabinetCategoriesForm from '~/modules/cabinet/components/CabinetCategoriesForm';
import CabinetRequirementsForm from '~/modules/cabinet/components/CabinetRequirementsForm';

export default {
    components: {
        CabinetForm,
        FormBlock,
        PageHeader,
        SeoRelationForm,
        CabinetDocumentsForm,
        CabinetCategoriesForm,
        ExternalLinkIcon,
        CabinetRequirementsForm,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список кабинетов', href: '/cabinets' },
            { text: 'Редактирование кабинета' },
        ],
    }),
    async fetch() {
        await this.getCabinet(this.$route.params.id);
        this.initForm();
        this.fillForm(this.cabinet);
    },
    head: {
        title: 'Редактирование кабинета',
    },
    computed: {
        ...mapGetters({
            cabinet: 'cabinet/cabinet',
            cabinetSeo: 'cabinet/cabinetSeo',
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
            getCabinet: 'cabinet/getCabinet',
        }),
        ...mapMutations({
            initForm: 'forms/cabinet/INIT_FORM',
            fillForm: 'forms/cabinet/FILL_FORM',
            closeAllPanels: 'helper/closeAllPanels',
            updatePanel: 'helper/updatePanel',
        }),
        async updateCabinet(form) {
            try {
                await form.put(`/admin/cabinets/${this.$route.params.id}`);
                this.$snackbar(`Кабинет успешно обновлен`);
                this.closeAllPanels();
                this.$nuxt.refresh();
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении кабинета: ${e.message}`);
            }
        },
        async updateCabinetSeo(form) {
            try {
                await form.patch(`/admin/cabinets/${this.$route.params.id}/seo`);
                this.$snackbar(`SEO кабинета успешно обновлено`);
                this.closeAllPanels();
                this.$nuxt.refresh();
            } catch (e) {
                this.$snackbar(`Прозиошла ошибка при обоновлении seo у кабинета: ${e.message}`);
            }
        },
    },
};
</script>
