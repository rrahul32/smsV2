import { User } from '@shared/types'
import mongoose, { ProjectionType } from 'mongoose'
import { usersSchema } from './schema'
export class UsersDbService {
  private db = mongoose.model<User>('Users', usersSchema)

  getUserById(id: string, fields?: ProjectionType<User>) {
    return this.db.findById(id, fields).lean()
  }

  getUserByFilter(filter: mongoose.FilterQuery<User>) {
    return this.db.findOne(filter).lean()
  }
}
