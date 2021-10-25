const property = {
    namespaced: true,

    state: () => ({
        properties: [],
    }),

    mutations: {
        setProperties(state, data) {
            state.properties = data;
        },
    },

    getters: {
        properties(state) {
            return state.properties;
        },
    },

    actions: {
        async getProperties({ commit }) {
            const { data } = await this.$axios.$get('/properties/all');
            commit('setProperties', data);
        },
    },
};

export default property;
