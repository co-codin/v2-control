import { Model as BaseModel } from 'vue-api-query'
import moment from "moment";

export default class Model extends BaseModel {

  baseURL() {
    return process.env.API_URL
  }

  request(config) {
    return this.$http.request(config)
  }

  whereIn(key, array) {

    if (!Array.isArray(array)) {
      throw new Error('The second argument on whereIn() method must be an array.');
    }

    if(Array.isArray(key)) {
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
    return moment(this[field]);
  }

  static query() {
    return this;
  }
}
