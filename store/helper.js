const helper = {
    namespaced: true,

    state: () => ({
        openedPanel: [],
    }),

    mutations: {
        closeAllPanels(state) {
            state.openedPanel = [];
        },
        updatePanel(state, index) {
            if (index) {
                state.openedPanel.push(data);
            }
        },
    },

    getters: {
        openedPanel(state) {
            return state.openedPanel;
        },
    },
};

export default helper;
