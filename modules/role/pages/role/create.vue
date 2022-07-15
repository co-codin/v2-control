<template>
    <div>
        <page-header h1="Добавление роля" :breadcrumbs="breadcrumbs" />
        <v-expansion-panels :value="0">
            <form-block title="Основная информация">
                <role-form @send="createRole" />
            </form-block>
        </v-expansion-panels>
    </div>
</template>

<script>
import RoleForm from '~/modules/role/components/RoleForm'
import FormBlock from '~/components/forms/FormBlock';
import PageHeader from '~/components/common/PageHeader';

export default {
    components: {
        PageHeader,
        FormBlock,
        RoleForm,
    },
    data: () => ({
        breadcrumbs: [
            { text: 'Список ролей', to: { name: 'roles.index' } },
            { text: 'Добавление роля' },
        ],
    }),
    head: {
        title: 'Добавление роля',
    },
    methods: {
        async createRole(form) {
            try {
                await form.post('/admin/roles');
                this.$snackbar(`Роль ${form.name} успешно добавлен`);
                await this.$router.push({ name: 'roles.index' });
            } catch (e) {
                this.$snackbar(`Произошла ошибка при создании роля: ${e.message}`);
            }
        },
    },
};
</script>
