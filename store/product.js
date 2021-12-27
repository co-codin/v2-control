import Product from '~/modules/product/models/Product';

export default {
    state: () => ({
        product: null,
        productSeo: null,
    }),

    mutations: {
        SET_PRODUCT(state, data) {
            data.status = data.status.value;
            data.categories = data.categories.map((category) => ({
                id: category.id,
                is_main: Boolean(category.is_main),
            }));
            state.product = data;
        },
        SET_PRODUCT_SEO(state, data) {
            state.productSeo = data;
        },
    },

    getters: {
        product(state) {
            return state.product;
        },
        productSeo(state) {
            return state.productSeo;
        },
    },

    actions: {
        async getProduct({ commit }, id) {
            const product = await Product.query()
                .with('seo', 'categories', 'properties', 'brand', 'images', 'productVariations.currency', 'analogs')
                .$find(id);
            commit('SET_PRODUCT', product);
            commit('SET_PRODUCT_SEO', product.seo || {});
        },
    },
};
