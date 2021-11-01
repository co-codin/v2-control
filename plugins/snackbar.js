import Vue from 'vue';
import VuetifySnackbar from './vuetify-snackbar';

export default ({ app }) => {
    Vue.use(VuetifySnackbar, { vuetify: app.vuetify });
};
