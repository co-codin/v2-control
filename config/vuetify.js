import Vue from 'vue';
import Vuetify from 'vuetify';
import theme from '@/config/theme';

Vue.use(Vuetify);

export default new Vuetify({
    rtl: theme.isRTL,
    theme: {
        dark: theme.globalTheme === 'dark',
        options: {
            customProperties: true,
        },
        themes: {
            dark: theme.dark,
            light: theme.light,
        },
    },
});
