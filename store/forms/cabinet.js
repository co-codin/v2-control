import Form from 'form-backend-validation';
import _, { set } from 'lodash';

import { objectToFormData } from 'form-backend-validation/dist/util';

export default {
    state: () => ({
        form: null,
        formDefaults: {
            category_id: null,
            name: null,
            slug: null,
            full_description: null,
            welcome_text: null,
            image: null,
            is_image_changed: false,
            status: 2,
            view_num: null,
            categories: [],
            requirements: [],
            documents: [],
        },
    }),

    mutations: {
        UPDATE_FIELD(state, { field, value }) {
            set(state.form, field, value);
        },
        FILL_FORM(state, data) {
            state.form.populate({
                ...data,
                requirements: data.requirements || [],
                documents: data.documents || [],
            });
        },
        INIT_FORM(state) {
            state.form = Form.create(state.formDefaults).withOptions({ http: this.$axios, resetOnSuccess: false });
        },
        CLEAR_FORM(state) {
            state.form.categories = state.form.categories.filter((category) => category.name !== null);
        },
        FILL_ERRORS(state, errors) {
            state.form.errors.record(errors);
        },
    },

    getters: {
        form: (state) => state.form,
    },

    actions: {
        async createCategories({ state, commit }, cabinetId) {
            await this.$axios.put(`/admin/cabinets/${cabinetId}/categories`, state.form.data());
        },
        async createCabinet({ state }) {
            const data = objectToFormData(state.form.data());
            await this.$axios.post(`/admin/cabinets`, data);
        },
        async updateCabinet({ state }, cabinetId) {
            const data = objectToFormData(state.form.data());
            await this.$axios.put(`/admin/cabinets/${cabinetId}`, data);
        },
    },
};
