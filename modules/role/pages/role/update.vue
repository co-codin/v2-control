<template>
    <div>
        <page-header h1="Редактирование роля" :breadcrumbs="breadcrumbs" />
        <template v-if="!$fetchState.pending">
            <v-expansion-panels v-model="openedPanel" multiple>
                <form-block title="Основная информация">
                    <role-form :role="role" is-updating @send="updateRole" />
                </form-block>
                <form-block title="Права доступа">
                    <role-permission-form :role="role" />
                </form-block>
            </v-expansion-panels>
        </template>
    </div>
</template>

<script>
import RoleForm from '~/modules/role/components/RoleForm'
import PageHeader from '~/components/common/PageHeader';
import FormBlock from '~/components/forms/FormBlock';
import RolePermissionForm from "~/modules/role/components/RolePermissionForm";
import Role from '~/modules/role/models/Role';

export default {
    components: {
        FormBlock,
        PageHeader,
        RoleForm,
        RolePermissionForm
    },
    data: () => ({
        role: null,
        isLoading: true,
        openedPanel: [],
        breadcrumbs: [
            { text: 'Список ролей', to: { name: 'roles.index' } },
            { text: 'Редактирование роля' },
        ],
    }),
    async fetch() {
        this.role = await Role.include('permissions').$find(this.$route.params.id)

        this.isLoading = false;
    },
    head: {
        title: 'Редактирование роля',
    },
    methods: {
        async updateRole(form) {
            try {
                await form.put(`/admin/roles/${this.$route.params.id}`);
                this.openedPanel = [];
                this.$snackbar(`Роля успешно обновлен`);
            } catch (e) {
                this.$snackbar(`Приозошла ошибка при обновлении роля: ${e.message}`);
            }
        },
    },
};
</script>
