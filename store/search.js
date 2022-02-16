import Search from '~/modules/search/models/Search';

const search = {
    namespaced: true,
    state: () => ({
        searchResults: [],
    }),
    mutations: {
        setSearchResults(state, data) {
            state.searchResults = data;
        },
    },
    getters: {
        searchResults(state) {
            return state.searchResults;
        },
    },
    actions: {
        async getSearchResults({ commit }) {
            const data = await Search.query().custom('/admin/global-search').$get();
            commit('setSearchResults', data);
        },
    },
};

export default search;
