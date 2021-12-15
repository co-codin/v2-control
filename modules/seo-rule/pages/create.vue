<template>
    <div>
        <page-header h1="Добавление SEO правила" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <form-block title="Основная информация">
                <seo-rule-form @send="createSeoRule" />
            </form-block>
        </v-expansion-panels>
    </div>
</template>

<script>
import SeoRuleForm from '../components/SeoRuleForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        SeoRuleForm,
        PageHeader,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Список SEO правил', to: { name: 'seo-rules.index' } },
            { text: 'Добавление SEO правила' },
        ],
    }),
    head: {
        title: 'Добавление SEO правила',
    },
    methods: {
        async createSeoRule(form) {
            try {
                await form.post('/admin/seo-rules');
                this.$snackbar(`SEO правило ${form.name} успешно добавлено`);
                await this.$router.push({ name: 'seo-rules.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при сохранении: ${e.message}`);
            }
        },
    },
};
</script>
