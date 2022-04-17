export default function ({ store }) {
    if (store.getters['category/categoriesLoaded']) {
        return;
    }

    return store.dispatch('category/getCategories');
}
