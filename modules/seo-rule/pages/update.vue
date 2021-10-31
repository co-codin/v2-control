<template>
    <div>
        <page-header h1="Редактирование SEO правила" :breadcrumbs="breadcrumbs" />
        <seo-rule-form v-if="seoRule" :seo-rule="seoRule" is-updating @send="updateSeoRule" />
        <seo-relation-form :seo="seo" class="mt-3" @send="updateSeoRuleSeo" />
    </div>
</template>

<script>
import SeoRuleForm from '../components/SeoRuleForm';
import SeoRule from '~/modules/seo-rule/models/SeoRule';
import PageHeader from "~/components/common/PageHeader";
import SeoRelationForm from '~/components/forms/SeoRelationForm';

export default {
    components: {
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
        title: 'Редактирование достижения',
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
