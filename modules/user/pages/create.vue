<template>
    <div>
        <page-header h1="Добавление пользователя" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <form-block title="Основная информация">
                <user-form @send="createUser" />
            </form-block>
        </v-expansion-panels>
    </div>
</template>

<script>
import UserForm from "~/modules/user/components/UserForm";
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';

export default {
    components: {
        FormBlock,
        UserForm,
        PageHeader,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Список пользователей', to: { name: 'users.index' } },
            { text: 'Добавление пользователя' },
        ],
    }),
    head: {
        title: 'Добавление пользователя',
    },
    methods: {
        async createUser(form) {
            try {
                await form.post('/admin/users');
                this.$snackbar(`Пользователь успешно добавлен`);
                await this.$router.push({ name: 'users.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при сохранении: ${e.message}`);
            }
        },
    },
};
</script>
