export default function ({ store }) {
    if (store.getters['enums/loaded']) {
        return;
    }

    return store.dispatch('enums/loadAllEnums');
}
