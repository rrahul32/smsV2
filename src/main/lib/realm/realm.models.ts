import Realm, { PrimitivePropertyTypeName } from 'realm'

export class Users extends Realm.Object {
  static schema = {
    name: 'users',
    primaryKey: '_id',
    properties: {
      _id: {
        type: 'objectId' as PrimitivePropertyTypeName,
        default: () => new Realm.BSON.ObjectId()
      },
      username: 'string',
      password: 'string',
      name: 'string'
    }
  }
}
