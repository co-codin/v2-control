<template>
    <div>
        <page-header h1="Редактирование кабинета" :breadcrumbs="breadcrumbs" />
        <div class="mb-2">
            <v-btn
                target="_blank"
                link
                :href="``"
                color="info"
                dark
            >
                <external-link-icon class="h-6 w-6 mr-1" /> Посмотреть на сайте
            </v-btn>
        </div>
        <template v-if="!$fetchState.pending">
            <v-expansion-panels>
                <form-block title="Основная информация">
                    <cabinet-form :cabinet="cabinet" is-updating @send="updateCabinet" />
                </form-block>
                <form-block title="Оснащение">
                    <cabinet-categories-form />
                </form-block>
                <form-block title="Документы">
                    <cabinet-documents-form />
                </form-block>
                <form-block title="Требования">
                    <cabinet-requirements-form />
                </form-block>
                <form-block title="SEO">
                    <seo-relation-form :seo="seo" @send="updateCabinetSeo" />
                </form-block>
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
import ExternalLinkIcon from '~/components/heroicons/ExternalLinkIcon';
import SeoRelationForm from '@/components/forms/SeoRelationForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';
import CabinetForm from '~/modules/cabinet/components/CabinetForm';
import CabinetDocumentsForm from "~/modules/cabinet/components/CabinetDocumentsForm";
import CabinetCategoriesForm from "~/modules/cabinet/components/CabinetCategoriesForm";
import CabinetRequirementsForm from "~/modules/cabinet/components/CabinetRequirementsForm";

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
        cabinet: null,
        seo: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список кабинетов', href: '/cabinets' },
            { text: 'Редактирование кабинета' },
        ],
    }),
    async fetch() {
        const { data } = await this.$axios.get(`/cabinets/${this.$route.params.id}`, {
            params: {
                include: ['seo'],
            },
        });
        data.data.status = data.data.status.value;
        this.seo = data.data.seo || {};
        this.cabinet = data.data;
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование кабинета',
    },
    methods: {
        async updateCabinet(form) {
            try {
                await form.put(`/admin/cabinets/${this.$route.params.id}`);
                this.$snackbar(`Кабинет успешно обновлен`);
                await this.$router.push({ name: 'cabinets.index' });
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении кабинета: ${e.message}`);
            }
        },
        async updateCabinetSeo(form) {
            try {
                await form.patch(`/admin/cabinets/${this.$route.params.id}/seo`);
                this.$snackbar(`SEO кабинета успешно обновлено`);
                await this.$router.push({ name: 'cabinets.index' });
            } catch (e) {
                this.$snackbar(`Прозиошла ошибка при обоновлении seo у кабинета: ${e.message}`);
            }
        },
    },
};
</script>
