<template>
    <v-menu offset-y left transition="slide-y-transition">
        <template #activator="{ on }">
            <v-btn class="elevation-2" v-on="on">
                {{ $auth.user.email }}
            </v-btn>
        </template>

        <!-- user menu list -->
        <v-list dense nav>
            <v-list-item @click="logout">
                <v-list-item-icon>
                    <v-icon small>mdi-logout-variant</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Выйти</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
import config from '../../config';

export default {
    data() {
        return {
            menu: config.toolbar.user,
        };
    },
    methods: {
        async logout() {
            await this.$auth.logout('local');
            this.$router.push({ name: 'login' });
        },
    },
};
</script>
