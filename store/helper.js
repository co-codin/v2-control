const helper = {
    namespaced: true,

    state: () => ({
        openedPanel: null,
    }),

    mutations: {
        closeAllPanels(state) {
            state.openedPanel = null;
        },
        updatePanel(state, index) {
            state.openedPanel = index;
        },
    },

    getters: {
        openedPanel(state) {
            return state.openedPanel;
        },
    },
};

export default helper;
