import Form from 'form-backend-validation';
import { set } from 'lodash';
import { objectToFormData } from 'form-backend-validation/dist/util';

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
        ADD_DOCUMENT_GROUP(state) {
            state.form.documents.push({
                document_group_id: null,
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
        ADD_DOCUMENT(state, document_group_id) {
            state.form.documents
                .filter((document) => document.document_group_id === document_group_id)
                .docs.push({
                    name: null,
                    type: null,
                    source: null,
                    file: null,
                    link: null,
                });
        },
        REMOVE_DOCUMENT_GROUP(state, index) {
            state.form.documents.splice(index, 1);
        },
        REMOVE_DOCUMENT(state, { document_group_id, index }) {
            state.form.documents
                .filter((document) => document.document_group_id === document_group_id)
                .docs.splice(index, 1);
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
            await this.$axios.post(`/admin/cabinets/${cabinetId}?_method=patch`, data);
        },
        async createDocuments({ state, commit }, cabinetId) {
            const data = objectToFormData(state.form.data());
            await this.$axios.post(`/admin/cabinets/${cabinetId}/documents?_method=put`, data);
        },
    },
};
