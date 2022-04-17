export default {
    state: () => ({
        enums: null,
    }),

    mutations: {
        SET_ENUMS(state, enums) {
            state.enums = enums
        }
    },

    getters: {
        loaded: (state) => !! state.enums,
        enums: (state) => {
            const result = {}

            Object.entries(state.enums || {}).forEach(([key, value]) => {
                result[key] = value.items
            })

            return result
        },
        enumsAsArray: (state) => {
            const result = {}

            Object.entries(state.enums || {}).forEach(([key, value]) => {
                result[key] = Object.entries(value.items).map(([key, value]) => ({ value: key, text: value }))
            })

            return result
        },
        getEnum: (state) => (name) => state?.[name]?.items || [],
        getEnumItemDescription: (state) => (name, value) => state?.[name]?.items?.[value]
    },

    actions: {
        async loadAllEnums({ state, commit }) {
            try {
                const { data } = await this.$axios.get('/enums')

                commit('SET_ENUMS', data.enums)
            }
            catch (e) {
                console.log('Error on loading enums')
            }
        }
    },
};
