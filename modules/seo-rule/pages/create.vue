<template>
    <div>
        <page-header h1="Добавление SEO правила" :breadcrumbs="breadcrumbs" />
        <seo-rule-form @send="createSeoRule" />
    </div>
</template>

<script>
import SeoRuleForm from '../components/SeoRuleForm';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        SeoRuleForm,
        PageHeader,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список SEO правил', href: '/seo-rules' },
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
