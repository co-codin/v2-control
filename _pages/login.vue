<template>
    <v-form ref="form" @submit.prevent="login">
        <v-text-field v-model="email" label="E-mail" required />

        <v-text-field v-model="password" label="Пароль" required />

        <v-btn type="submit" color="primary" class="mr-4">Войти</v-btn>
    </v-form>
</template>

<script>
export default {
    layout: 'auth',
    data: () => ({
        email: '',
        password: '',
    }),

    methods: {
        async login() {
            try {
                await this.$auth.loginWith('local', {
                    data: {
                        email: this.email,
                        password: this.password,
                    },
                });
            } catch (err) {
                console.log(err);
            }
        },
    },
};
</script>
