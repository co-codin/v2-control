import Model from '@/models/Model'

export default class Product extends Model
{
  resource() {
    return 'products'
  }

  get fullName() {
    return this.brand?.name + ' ' + this.name;
  }
}
