export default {
    /**
     * Theme and Layout
     */
    setGlobalTheme: (state, theme) => {
        this.$vuetify.framework.theme.dark = theme === 'dark';
        state.globalTheme = theme;
    },
    setRTL: (state, isRTL) => {
        this.$vuetify.framework.rtl = isRTL;
        state.isRTL = isRTL;
    },
    setContentBoxed: (state, isBoxed) => {
        state.isContentBoxed = isBoxed;
    },
    setMenuTheme: (state, theme) => {
        state.menuTheme = theme;
    },
    setToolbarTheme: (state, theme) => {
        state.toolbarTheme = theme;
    },
    setTimeZone: (state, zone) => {
        state.time.zone = zone;
    },
    setTimeFormat: (state, format) => {
        state.time.format = format;
    },
    setCurrency: (state, currency) => {
        state.currency = currency;
    },
    setToolbarDetached: (state, isDetached) => {
        state.isToolbarDetached = isDetached;
    },
};
