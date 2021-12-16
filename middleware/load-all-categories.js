export default function ({ store }) {
    if (store.getters['category/categoriesLoaded']) {
        return;
    }
    store.dispatch('category/getCategories');
}
