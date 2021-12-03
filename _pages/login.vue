<template>
    <v-form ref="form" @submit.prevent="login">
        <v-text-field v-model="email" label="E-mail" required autofocus />

        <v-text-field v-model="password" type="password" label="Пароль" required autofocus />

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

    // mounted() {
    //     console.log(this.email);
    //     console.log(this.password);
    // },

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
