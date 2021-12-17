import Form from 'form-backend-validation';
import _, { set } from 'lodash';

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
            data.documents = _.chain(data.documents)
                .groupBy('document_group_id')
                .map((key, value) => {
                    return {
                        document_group_id: parseInt(value, 10),
                        document_group_name: key[0].document_group.name,
                        docs: key,
                    };
                })
                .value();
            // data.requirements = _.chain(data.requirements)
            //     .groupBy('document_group_id')
            //     .map((key, value) => {
            //         return {
            //             document_group_id: parseInt(value, 10),
            //             document_group_name: key[0].document_group.name,
            //             docs: key,
            //         };
            //     })
            //     .value();
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
        ADD_REQUIREMENT(state, index) {
            state.form.requirements[index].requirements.push({
                key: null,
                value: null,
            });
        },
        ADD_REQUIREMENT_GROUP(state) {
            state.form.requirements.push({
                group_name: null,
                requirements: [
                    {
                        key: null,
                        value: null,
                    },
                ],
            });
        },
        REMOVE_REQUIREMENT(state, data) {
            state.form.requirements[data.index].requirements.splice(data.i, 1);
        },
        REMOVE_REQUIREMENT_GROUP(state, index) {
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
        ADD_DOCUMENT(state, index) {
            state.form.documents[index].docs.push({
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
        REMOVE_DOCUMENT(state, data) {
            state.form.documents[data.index].docs.splice(data.i, 1);
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
