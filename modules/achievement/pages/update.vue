<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex align-center py-3">
            <div>
                <div class="display-1">Редактирование достижения</div>
                <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
            </div>
        </div>

        <v-card :loading="isLoading" class="mb-3">
            <v-card-title> Основная информация </v-card-title>
            <v-card-text v-if="achievement">
                <achievement-form :achievement="achievement" is-updating @send="updateAchievement" />
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import AchievementForm from '../components/AchievementForm';

export default {
    components: {
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
                this.$snackbar(`Приозошла ошибка при обновлении Достижения: ${e.message}`);
            }
        },
    },
};
</script>
