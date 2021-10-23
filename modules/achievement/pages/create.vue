<template>
    <div class="d-flex flex-column flex-grow-1">
        <div class="d-flex align-center py-3">
            <div>
                <div class="display-1">Добавление достижения</div>
                <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
            </div>
        </div>

        <v-card class="pa-2">
            <achievement-form @send="createAchievement">
                <template slot="buttons">
                    <v-btn type="submit">Добавить</v-btn>
                </template>
            </achievement-form>
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
