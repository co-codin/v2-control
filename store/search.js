import Search from '~/modules/search/models/Search';

const search = {
    namespaced: true,
    state: () => ({
        search: null,
        searchResults: [],
    }),
    mutations: {
        setSearch(state, data) {
            state.search = data;
        },
        setSearchResults(state, data) {
            state.searchResults = data;
        },
    },
    getters: {
        searchResults(state) {
            return state.searchResults;
        },
        search(state) {
            return state.search;
        },
    },
    actions: {
        async getSearchResults({ commit }, query) {
            const data = await Search.query().custom(`/admin/global-search?term=${query}`).$get();
            commit('setSearchResults', data);
        },
    },
};

export default search;
