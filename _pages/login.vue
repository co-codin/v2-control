<template>
    <v-form @submit.prevent="login">
        <v-text-field
            v-model="email"
            placeholder=" "
            persistent-placeholder
            label="E-mail"
            required
            :class="{ 'input-group--dirty': dirtyEmail }"
        />

        <v-text-field
            v-model="password"
            placeholder=" "
            persistent-placeholder
            type="password"
            label="Пароль"
            required
            :class="{ 'input-group--dirty': dirtyPwd }"
        />

        <v-btn type="submit" color="primary" class="mr-4">Войти</v-btn>
    </v-form>
</template>

<script>
export default {
    layout: 'auth',
    data: () => ({
        email: null,
        password: null,
        autofilled: false,
        dirtyEmail: null,
        dirtyPwd: null,
    }),

    watch: {
        email: {
            handler(value) {
                if (value) {
                    this.autofilled = true;
                }
            },
        },
        password: {
            handler(value) {
                if (value) {
                    this.autofilled = true;
                }
            },
        },
    },
    mounted() {
        let times = 0;
        const interval = setInterval(() => {
            times += 1;
            if ((this.dirtyEmail && this.dirtyPwd) || times === 20) {
                clearInterval(interval);
            }
            this.dirtyEmail = document.querySelector('input[type="email"]:-webkit-autofill');
            this.dirtyPwd = document.querySelector('input[type="password"]:-webkit-autofill');
        }, 100);
    },

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
