<template>
    <div>
        <page-header h1="Редактирование достижения" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels v-if="achievement">
            <achievement-form :achievement="achievement" is-updating @send="updateAchievement" />
        </v-expansion-panels>
    </div>
</template>

<script>
import AchievementForm from '../components/AchievementForm';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
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
