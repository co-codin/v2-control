<template>
    <v-form v-if="form" @submit.prevent="savePermissions">
        <v-switch
            v-for="permission in permissions"
            :key="permission.id"
            inset
            :label="permission.description"
            hide-details
            @change="updatePermission"
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
        await this.loadPermissions()

        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
        // .populate(this.role || {});
    },
    data: () => ({
        formDefaults: {
            permissions: {}
        },
        form: null,
        permissions: []
    }),
    methods: {
        updatePermission(permission, value) {

        },
        async loadPermissions() {
            try {
                this.permissions = await Permission.custom('admin/permissions/all').select({
                    permissions: ['id', 'description']
                }).orderBy('description').$get()
            }
            catch (e) {
                alert('cant load permissions')
            }
        },
        async savePermissions() {
            try {
                await this.form.put(`/admin/roles/${this.role.id}/permissions`)
            }
            catch(e) {
                console.log(e)
            }
        }
    }
}
</script>
