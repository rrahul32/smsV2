import Realm, { PrimitivePropertyTypeName } from 'realm'

export const ItemSchema = {
  name: 'Item',
  properties: {
    _id: 'objectId',
    name: 'string'
  },
  primaryKey: '_id'
}

export class Item extends Realm.Object {
  static schema = ItemSchema
}

export class Dog extends Realm.Object {
  static schema = {
    name: 'Dog',
    primaryKey: '_id',
    properties: {
      _id: {
        type: 'objectId' as PrimitivePropertyTypeName,
        default: () => new Realm.BSON.ObjectId()
      },
      name: 'string',
      age: 'int'
    }
  }
}
