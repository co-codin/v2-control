<template>
    <div>
        <page-header h1="Редактирование достижения" :breadcrumbs="breadcrumbs" />
        <template v-if="!$fetchState.pending">
            <v-expansion-panels>
                <form-block title="Основная информация">
                    <achievement-form :achievement="achievement" is-updating @send="updateAchievement" />
                </form-block>
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
import AchievementForm from '../components/AchievementForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        PageHeader,
        AchievementForm,
    },
    data: () => ({
        achievement: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Главная', disabled: false, href: '/' },
            { text: 'Список достижений', href: '/achievements' },
            { text: 'Редактирование достижения' },
        ],
    }),
    async fetch() {
        const { data } = await this.$axios.get(`/achievements/${this.$route.params.id}`);
        this.achievement = data.data;
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование достижения',
    },
    methods: {
        async updateAchievement(form) {
            try {
                await form.put(`/admin/achievements/${this.$route.params.id}`);
                this.$snackbar(`Достижение успешно обновлено`);
                await this.$router.push({ name: 'achievements.index' });
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении достижения: ${e.message}`);
            }
        },
    },
};
</script>
