import Form from 'form-backend-validation';
import { set } from 'lodash';

export default {
    state: () => ({
        form: null,
        formDefaults: {
            variations: [],
        },
    }),

    mutations: {
        UPDATE_FIELD(state, { field, value }) {
            set(state.form, field, value);
        },
        FILL_FORM(state, data) {
            state.form.populate(data);
        },
        REMOVE_VARIATION(state, index) {
            state.form.variations.splice(index, 1);
        },
        ADD_VARIATION(state) {
            state.form.variations.push({
                price: null,
                previous_price: null,
                currency_id: 1,
                name: null,
                availability: 2,
                is_price_visible: false,
                is_enabled: false,
                condition_id: null,
            });
        },
        INIT_FORM(state) {
            state.form = Form.create(state.formDefaults).withOptions({ http: this.$axios, resetOnSuccess: false });
        },
        CLEAR_FORM(state) {
            state.form.variations = state.form.variations.filter((variation) => variation.name !== null);
        },
        FILL_ERRORS(state, errors) {
            state.form.errors.record(errors);
        },
    },

    getters: {
        form: (state) => state.form,
    },

    actions: {
        async createConfigurator({ state, commit }, productId) {
            // commit('CLEAR_FORM');
            await this.$axios.put(`/admin/products/${productId}/configurator`, state.form.data());
        },
    },
};
