<template>
    <v-form v-if="form" @submit.prevent="savePermissions">
        <v-expansion-panels>
            <v-expansion-panel v-for="(group, name) in groupedPermissions" :key="name">
                <v-expansion-panel-header class="subtitle-1">
                    {{ name }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-switch
                        v-for="permission in group"
                        :key="permission.id"
                        :input-value="permission.level"
                        inset
                        :label="permission.description"
                        hide-details
                        @change="updatePermission(permission.id, $event)"
                    />
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
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
import groupBy from 'lodash/groupBy';

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
    computed: {
        groupedPermissions() {
            return groupBy(this.form?.permissions ?? [], 'module')
        }
    },
    methods: {
        updatePermission(id, level) {
            const permission = this.form.permissions.find((permission) => permission.id === id)
            permission.level = level
        },
        async loadPermissions() {
            try {
                const permissions = await Permission.custom('admin/permissions/all').select({
                    permissions: ['id', 'description', 'module']
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
