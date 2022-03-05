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
        async getSearchResults({ commit }, query) {
            const data = await this.$axios.$get(`/admin/global-search?term=${query}`);
            commit('setSearchResults', data);
        },
    },
};

export default search;
