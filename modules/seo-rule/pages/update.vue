<template>
    <div>
        <page-header h1="Редактирование SEO правила" :breadcrumbs="breadcrumbs" />
        <template v-if="!$fetchState.pending">
            <v-expansion-panels>
                <form-block title="Основная информация">
                    <seo-rule-form v-if="seoRule" :seo-rule="seoRule" is-updating @send="updateSeoRule" />
                </form-block>
                <form-block title="SEO">
                    <seo-relation-form :seo="seo" class="mt-3" @send="updateSeoRuleSeo" />
                </form-block>
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
import SeoRuleForm from '../components/SeoRuleForm';
import SeoRule from '~/modules/seo-rule/models/SeoRule';
import PageHeader from '~/components/common/PageHeader';
import SeoRelationForm from '~/components/forms/SeoRelationForm';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        SeoRuleForm,
        SeoRelationForm,
        PageHeader,
    },
    data: () => ({
        seoRule: null,
        seo: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список SEO правил', href: '/seo-rules' },
            { text: 'Редактирование SEO правила' },
        ],
    }),
    async fetch() {
        this.seoRule = await SeoRule.with('seo').$find(this.$route.params.id);
        this.seo = this.seoRule.seo || {};
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование SEO правила',
    },
    methods: {
        async updateSeoRule(form) {
            try {
                await form.put(`/admin/seo-rules/${this.$route.params.id}`);
                this.$snackbar(`SEO правило успешно обновлено`);
                await this.$router.push({ name: 'seo-rules.index' });
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении: ${e.message}`);
            }
        },
        async updateSeoRuleSeo(form) {
            try {
                await form.patch(`/admin/seo-rules/${this.seoRule.id}/seo`);
                this.$snackbar(`SEO успешно обновлено`);
            } catch (e) {
                this.$snackbar(`Произошла ошибка при обновлении: ${e.message}`);
            }
        },
    },
};
</script>
