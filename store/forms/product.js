export default {
    state: () => ({
        product: null,
    }),

    mutations: {
        SET_PRODUCT(state, product) {
            state.product = product;
        },
    },

    getters: {
        product(state) {
            return state.product;
        },
    }
}
