import { toTree } from '~/helpers';

const category = {
    namespaced: true,

    state: () => ({
        categories: [],
    }),

    mutations: {
        setCategories(state, data) {
            state.categories = data;
        },
    },

    getters: {
        categories(state) {
            return state.categories;
        },

        categoryTree(state) {
            return toTree(state.categories);
        },
    },

    actions: {
        async getCategories({ commit, state }) {
            if (!state.categories) {
                const { data } = await this.$axios.$get('/categories/all');
                commit('setCategories', data);
            }
        },
    },
};

export default category;
