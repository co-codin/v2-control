import Cabinet from '~/modules/cabinet/models/Cabinet';

export default {
    state: () => ({
        cabinet: null,
        cabinetSeo: null,
    }),

    mutations: {
        SET_CABINET(state, data) {
            data.status = data.status.value;
            state.cabinet = data;
        },
        SET_CABINET_SEO(state, data) {
            state.cabinetSeo = data;
        },
    },

    getters: {
        cabinet(state) {
            return state.cabinet;
        },
        cabinetSeo(state) {
            return state.cabinetSeo;
        },
    },

    actions: {
        async getCabinet({ commit }, id) {
            const cabinet = await Cabinet.query().with('seo', 'categories').$find(id);
            commit('SET_CABINET', cabinet);
            commit('SET_CABINET_SEO', cabinet.seo || {});
        },
    },
};
