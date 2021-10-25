<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex align-center py-3">
            <div>
                <div class="display-1">Добавление SEO правила</div>
                <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
            </div>
        </div>

        <v-card class="pa-2">
            <seo-rule-form @send="createSeoRule">
                <template slot="buttons">
                    <v-btn type="submit">Добавить</v-btn>
                </template>
            </seo-rule-form>
        </v-card>
    </div>
</template>

<script>
import SeoRuleForm from '../components/SeoRuleForm';

export default {
    components: {
        SeoRuleForm,
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
