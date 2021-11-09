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
                availability: 1,
                is_price_visible: false,
                is_enabled: false,
            });
        },
        INIT_FORM(state) {
            state.form = Form.create(state.formDefaults).withOptions({ http: this.$axios, resetOnSuccess: false });
        },
        FILL_ERRORS(state, errors) {
            state.form.errors.record(errors);
        },
    },

    getters: {
        form: (state) => state.form,
    },

    actions: {
        async createConfigurator() {},
    },
};
