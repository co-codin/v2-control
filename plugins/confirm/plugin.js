import Vue from 'vue'
import VuetifyConfirm from './confirm'

export default ({ app }) => {
    Vue.use(VuetifyConfirm, { vuetify: app.vuetify })
}
