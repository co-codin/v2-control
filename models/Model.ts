import moment from "moment";
import BooleanCasts from "~/models/concerns/BooleanCasts";

export default abstract class Model {

  originalAttributes !: object;

  constructor(attributes: object)
  {
    this.fill(attributes);
  }

  dates(): string[]
  {
    return ['created_at', 'updated_at'];
  }

  public static hydrate(data: object[]): Model[]
  {
    // @ts-ignore
    return data.map(item => new this(item));
  }

  toJSON(): object
  {
    return this.originalAttributes;
  }

  public fill(attributes: object): void
  {
    this.originalAttributes = Object.assign({}, attributes);
    Object.assign(this, attributes);

    this.castDates();
    this.castAttributes();
  }

  protected castDates(): void
  {
    // @ts-ignore
    this.dates().forEach(field => this[field] = moment(this.originalAttributes[field]));
  }

  protected castAttributes(): void
  {
    // @ts-ignore
    if(typeof this.casts !== "function") {
      return;
    }

    // @ts-ignore
    const casts = this.casts();

    Object.keys(casts ?? {}).forEach(key => {

      // @ts-ignore
      let value = this.originalAttributes[key];

      switch (casts[key]) {
        // пока cast есть только для boolean
        case "boolean":
          value = new BooleanCasts(value);
          break;
      }

      // @ts-ignore
      this[key] = value;

    });
  }
}
