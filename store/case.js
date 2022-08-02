import Case from "~/modules/case/models/Case";

export default {
    state: () => ({
        case: null,
        caseSeo: null,
    }),

    mutations: {
        SET_CASE(state, data) {
            data.status = data.status.value;
            state.case = data;
        },
        SET_CASE_SEO(state, data) {
            state.caseSeo = data;
        },
    },

    getters: {
        case(state) {
            return state.case;
        },
        caseSeo(state) {
            return state.caseSeo;
        },
    },

    actions: {
        async getCase({ commit }, id) {
            const caseModel = await Case.query()
                .with('seo', 'images', 'products')
                .$find(id);

            commit('SET_CASE', caseModel);
            commit('SET_CASE_SEO', caseModel.seo || {});
        },
    },
};
