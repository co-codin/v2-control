import Model from "./Model";
import { Status } from "~/enums/enums";

export default class Brand extends Model {

  private status: any;

  public casts(): object|null
  {
    return {
      is_in_home: 'boolean',
    };
  }

  get isActive(): boolean
  {
    return this.status?.value === Status.Active;
  }

  get isInActive(): boolean
  {
    return this.status?.value === Status.Inactive;
  }

}
