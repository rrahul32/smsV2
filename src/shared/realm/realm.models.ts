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

export class Payments extends Realm.Object {
  static schema = {
    name: 'payments',
    primaryKey: '_id',
    properties: {
      _id: {
        type: 'objectId' as PrimitivePropertyTypeName,
        default: () => new Realm.BSON.ObjectId()
      },
      studentId: 'objectId',
      type: 'string',
      amount: 'float',
      createdAt: {
        type: 'date' as PrimitivePropertyTypeName,
        default: () => new Date()
      }
    }
  }
}

export class Students extends Realm.Object {
  static schema = {
    name: 'students',
    primaryKey: '_id',
    properties: {
      _id: {
        type: 'objectId' as PrimitivePropertyTypeName,
        default: () => new Realm.BSON.ObjectId()
      },
      name: 'string',
      fatherName: 'string',
      class: {
        type: 'string' as PrimitivePropertyTypeName
      },
      section: {
        type: 'string' as PrimitivePropertyTypeName
      },
      phone: 'int',
      admissionFee: 'float',
      tuitionFee: 'float',
      conveyanceFee: 'float',
      booksTotal: 'float',
      uniformTotal: 'float',
      joinedFrom: 'int',
      createdAt: {
        type: 'date' as PrimitivePropertyTypeName,
        default: () => new Date()
      }
    }
  }
}
