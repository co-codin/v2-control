<template>
    <v-form v-if="form" @submit.prevent="savePermissions">
        <v-switch
            v-for="permission in form.permissions"
            :key="permission.id"
            v-model="permission.level"
            inset
            :label="permission.description"
            hide-details
        />
        <v-row class="expansion-panel-actions mt-5">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import Form from "form-backend-validation";
import Role from "~/modules/role/models/Role";
import Permission from "~/modules/role/models/Permission";

export default {
    props: {
        role: {
            type: Role,
            required: true
        }
    },
    async created() {
        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })

        await this.loadPermissions()
    },
    data: () => ({
        formDefaults: {
            permissions: {}
        },
        form: null
    }),
    methods: {
        async loadPermissions() {
            try {
                const permissions = await Permission.custom('admin/permissions/all').select({
                    permissions: ['id', 'description']
                }).orderBy('description').$get()

                this.form.permissions = permissions.map((permission) => ({
                    ...permission,
                    level: !! this.role.permissions.find((rolePermission) => rolePermission.id === permission.id)
                }))
            }
            catch (e) {}
        },
        async savePermissions() {
            try {
                await this.form.put(`/admin/roles/${this.role.id}/permissions`)
                this.$snackbar('Права доступа успешно сохранены')
                await this.$router.push({ name: 'roles.index' })
            }
            catch(e) {
                this.$snackbar('Произошла ошибка при сохранении прав доступа')
            }
        }
    }
}
</script>
