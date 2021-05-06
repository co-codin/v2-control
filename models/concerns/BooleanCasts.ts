export default class BooleanCasts {

  private readonly value: boolean;

  constructor(value: boolean)
  {
    this.value = value;
  }

  get label()
  {
    return this.value ? 'Да' : 'Нет';
  }

}
