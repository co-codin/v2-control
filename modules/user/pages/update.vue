<template>
    <div>
        <page-header h1="Редактирование пользователя" :breadcrumbs="breadcrumbs" />
        <template v-if="!$fetchState.pending">
            <v-expansion-panels>
                <form-block title="Основная информация">
                    <user-form v-if="user" :user="user" is-updating @send="updateUser" />
                </form-block>
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
import User from "~/modules/user/models/User";
import UserForm from '~/modules/user/components/UserForm';
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        UserForm,
        PageHeader,
    },
    data: () => ({
        user: null,
        isLoading: true,
        breadcrumbs: [
            { text: 'Список пользователей', to: { name: 'users.index' } },
            { text: 'Редактирование пользователя' },
        ],
    }),
    async fetch() {
        this.user = await User.$find(this.$route.params.id);
        this.isLoading = false;
    },
    head: {
        title: 'Редактирование пользователя',
    },
    methods: {
        async updateUser(form) {
            try {
                await form.put(`/admin/users/${this.$route.params.id}`);
                this.$snackbar(`Пользователь успешно обновлен`);
                await this.$router.push({ name: 'users.index' });
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении: ${e.message}`);
            }
        },
    },
};
</script>
