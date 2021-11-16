import { Model as BaseModel } from 'vue-api-query';
import moment from 'moment';

export default class Model extends BaseModel {
    baseUrl = '';

    baseURL() {
        this.baseUrl = process.env.API_URL;

        return this.baseUrl;
    }

    request(config) {
        return this.$http.request(config);
    }

    whereIn(key, array) {
        if (!Array.isArray(array)) {
            throw new TypeError('The second argument on whereIn() method must be an array.');
        }

        if (Array.isArray(key)) {
            return super.whereIn(key, array);
        }

        this._builder.filters[key] = array.join('|');

        return this;
    }

    static hydrate(data) {
        return data.map((item) => this.hydrateRow(item));
    }

    static hydrateRow(item) {
        return new this(item);
    }

    asDate(field) {
        moment.locale('ru');
        return moment(this[field], 'DD-MM-YYYY');
    }

    static query() {
        return this;
    }

    delete() {
        this.baseURL = function () {
            return `${this.baseUrl}/admin`;
        };
        super.delete();
    }
}
