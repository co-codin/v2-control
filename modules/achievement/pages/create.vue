<template>
    <div>
        <page-header h1="Добавление достижения" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <form-block title="Основная информация">
                <achievement-form @send="createAchievement" />
            </form-block>
        </v-expansion-panels>
    </div>
</template>

<script>
import AchievementForm from '../components/AchievementForm';
import FormBlock from '~/components/forms/FormBlock';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        PageHeader,
        FormBlock,
        AchievementForm,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список достижений', href: '/achievements' },
            { text: 'Добавление достижения' },
        ],
    }),
    head: {
        title: 'Добавление достижения',
    },
    methods: {
        async createAchievement(form) {
            try {
                await form.post('/admin/achievements');
                this.$snackbar(`Достижение ${form.name} успешно добавлено`);
                await this.$router.push({ name: 'achievements.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании достижения: ${e.message}`);
            }
        },
    },
};
</script>
