<template>
    <v-form v-if="form" @submit.prevent="$emit('send', form)">
        <v-autocomplete
            :items="roles"
            item-text="name"
            item-value="id"
            label="Роль"
        />
        <v-text-field
            v-model="form.name"
            label="Имя"
            :error-messages="form.errors.get('name')"
            :error="form.errors.has('name')"
        />
        <v-text-field
            v-model="form.email"
            label="E-mail"
            :error-messages="form.errors.get('email')"
            :error="form.errors.has('email')"
        />
        <template v-if="isUpdating">
            <v-text-field
                v-model="form.email"
                label="E-mail"
                :error-messages="form.errors.get('email')"
                :error="form.errors.has('email')"
            />
        </template>
        <v-switch
            v-if="isUpdating"
            v-model="form.change_password"
            label="Сменить пароль"
            inset
        />
        <template v-if="!isUpdating || form.change_password">
            <v-text-field
                type="password"
                v-model="form.password"
                label="Пароль"
                :error-messages="form.errors.get('password')"
                :error="form.errors.has('password')"
            />
            <v-text-field
                type="password"
                v-model="form.password_confirmation"
                label="Потверждение пароля"
                :error-messages="form.errors.get('password_confirmation')"
                :error="form.errors.has('password_confirmation')"
            />
        </template>
        <v-row class="expansion-panel-actions mt-5">
            <v-col>
                <v-btn type="submit" color="green" class="white--text text-uppercase">Сохранить</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import { Form } from 'form-backend-validation';
import Role from "~/modules/role/models/Role";

export default {
    props: {
        user: {
            type: Object | null,
            default: () => ({}),
        },
        isUpdating: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        formDefaults: {
            name: null,
            email: null,
            change_password: false,
            password: null,
            password_confirmation: null,
        },
        form: null,
        roles: []
    }),
    watch: {
        user(value) {
            this.form.populate(value);
        },
    },
    async created() {
        this.roles = await Role.select({
            roles: ['id', 'name']
        }).orderBy('name').$get()

        this.form = Form.create(this.formDefaults)
            .withOptions({ http: this.$axios })
            .populate(this.user || {});
    },
};
</script>
