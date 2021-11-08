<template>
    <v-app>
        <div v-shortkey="['ctrl', '/']" class="d-flex flex-grow-1">
            <!-- Navigation -->
            <v-navigation-drawer
                v-model="drawer"
                app
                floating
                class="elevation-1"
                :light="menuTheme === 'light'"
                :dark="menuTheme === 'dark'"
            >
                <!-- Navigation menu info -->
                <template #prepend>
                    <div class="pa-2">
                        <div class="title font-weight-bold text-uppercase primary--text">{{ product.name }}</div>
                        <div class="overline grey--text">{{ product.version }}</div>
                    </div>
                </template>

                <!-- Navigation menu -->
                <main-menu :menu="navigation.menu" />

                <!-- Navigation menu footer -->
                <template #append>
                    <!-- Footer navigation links -->
                    <div class="pa-1 text-center">
                        <v-btn
                            v-for="(item, index) in navigation.footer"
                            :key="index"
                            :href="item.href"
                            :target="item.target"
                            small
                            text
                        >
                            {{ item.text }}
                        </v-btn>
                    </div>
                </template>
            </v-navigation-drawer>

            <!-- Toolbar -->
            <v-app-bar
                app
                :color="isToolbarDetached ? 'surface' : undefined"
                :flat="isToolbarDetached"
                :light="toolbarTheme === 'light'"
                :dark="toolbarTheme === 'dark'"
            >
                <v-card
                    class="flex-grow-1 d-flex"
                    :class="[isToolbarDetached ? 'pa-1 mt-3 mx-1' : 'pa-0 ma-0']"
                    :flat="!isToolbarDetached"
                >
                    <div class="d-flex flex-grow-1 align-center">
                        <div class="d-flex flex-grow-1 align-center">
                            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

                            <v-spacer class="d-none d-lg-block"></v-spacer>

                            <v-spacer class="d-block d-sm-none"></v-spacer>

                            <toolbar-user />
                        </div>
                    </div>
                </v-card>
            </v-app-bar>

            <v-main>
                <v-container class="fill-height" :fluid="!isContentBoxed">
                    <v-layout>
                        <nuxt class="d-flex flex-column flex-grow-1" />
                    </v-layout>
                </v-container>
            </v-main>
        </div>
    </v-app>
</template>

<script>
import { mapState } from 'vuex';

import config from '../config';

import MainMenu from '../components/navigation/MainMenu';
import ToolbarUser from '../components/toolbar/ToolbarUser';

export default {
    components: {
        MainMenu,
        ToolbarUser,
    },
    data() {
        return {
            drawer: null,

            navigation: config.navigation,
        };
    },
    computed: {
        ...mapState('app', ['product', 'isContentBoxed', 'menuTheme', 'toolbarTheme', 'isToolbarDetached']),
    },
};
</script>
