import Form from 'form-backend-validation';
import { set } from 'lodash';

export default {
    state: () => ({
        form: null,
        formDefaults: {
            name: null,
            slug: null,
            full_description: null,
            welcome_text: null,
            image: null,
            is_image_changed: false,
            status: 1,
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
        REMOVE_CATEGORY(state, index) {
            state.form.categories.splice(index, 1);
        },
        ADD_CATEGORY(state) {
            state.form.categories.push({
                id: null,
                name: null,
                count: null,
                price: null,
            });
        },
        ADD_REQUIREMENT(state) {
            state.form.requirements.push({
                key: null,
                value: null,
            });
        },
        REMOVE_REQUIREMENT(state, index) {
            state.form.requirements.splice(index, 1);
        },
        ADD_DOCUMENT(state) {
            state.form.documents.push({
                group_name: null,
                docs: [
                    {
                        name: null,
                        type: null,
                        source: null,
                        file: null,
                        link: null,
                    },
                ],
            });
        },
        REMOVE_DOCUMENT(state, index) {
            state.form.documents.splice(index, 1);
        },
        ADD_DOC(state, index) {},
        REMOVE_DOC(state, index) {},
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
            commit('CLEAR_FORM');
            await this.$axios.put(`/admin/cabinets/${cabinetId}/categories`, state.form.data());
        },
        async createCabinet({ state }) {
            await this.$axios.post(`/admin/cabinets`, state.form.data());
        },
        async updateCabinet({ state }, cabinetId) {
            await this.$axios.patch(`/admin/cabinets/${cabinetId}`, state.form.data());
        },
        async createDocuments({ state, commit }, cabinetId) {
            await this.$axios.put(`/admin/cabinets/${cabinetId}/documents`, state.form.data());
        },
    },
};
