export default function ({ store }, inject) {
    inject('enum', (name, asArray = false) => {
        if (asArray) {
            return store.getters['enums/enumsAsArray'][name]
        }

        return store.getters['enums/enums'][name]
    });
}
