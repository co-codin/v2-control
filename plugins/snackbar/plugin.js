import Vue from 'vue';
import VuetifySnackbar from './snackbar';

export default ({ app }) => {
    Vue.use(VuetifySnackbar, { vuetify: app.vuetify });
};
