import { toTree } from '~/helpers';
import Category from "~/modules/category/models/Category";

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

        categoriesLoaded(state) {
            return state.categories.length > 0;
        },
    },

    actions: {
        async getCategories({ commit }) {
            const categories = await Category.query()
                .select({
                    categories: ['id', 'name', 'parent_id', 'status'],
                })
                .custom('/categories/all')
                .orderBy('name')
                .$get();
            commit('setCategories', categories);
        },
    },
};

export default category;
