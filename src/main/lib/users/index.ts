import { Users } from '@shared/realm'
import { LoginInfo, LoginParams } from '@shared/types'
import { encode } from 'jwt-simple'
import { Database } from '../realm'
export class UsersService {
  private readonly JWT_KEY = import.meta.env.MAIN_JWT_SECRET_KEY
  private db: Database

  constructor(db: Database) {
    this.db = db
  }

  getUsers() {
    return this.db.getObjects<Users>(Users.schema.name)
  }

  async login(params: LoginParams): Promise<LoginInfo | boolean> {
    const users = this.getUsers()?.filtered('username == $0', params.username).toJSON()
    if (users && users.length === 1) {
      const user = users[0]
      if (user.password === params.password) {
        return {
          accessToken: encode({ id: user._id, username: user.username }, this.JWT_KEY),
          user: {
            id: user._id as string,
            name: user.name as string
          }
        }
      }
    }
    return false
  }
}
