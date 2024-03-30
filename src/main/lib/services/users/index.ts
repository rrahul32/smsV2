import { UsersDbService } from '@lib/db'
import { LoginInfo, LoginParams } from '@shared/types'
import { encode } from 'jwt-simple'

export class UsersService {
  private readonly JWT_KEY = import.meta.env.MAIN_JWT_SECRET_KEY
  private readonly usersDb = new UsersDbService()

  getAcademicYear(id: string) {
    return this.usersDb
      .getUserById(id)
      .then((user) => {
        if (user) {
          return user.academicYear
        } else {
          return null
        }
      })
      .catch((e) => {
        console.log('🚀 ~ UsersService ~ .then ~ e:', e.message)
        return null
      })
  }

  async login(params: LoginParams): Promise<LoginInfo | boolean> {
    const user = await this.usersDb
      .getUserByFilter({
        username: params.username,
        password: params.password
      })
      .catch((e) => {
        console.log('🚀 ~ UsersService ~ login ~ e:', e)
        return null
      })
    if (user) {
      return {
        accessToken: encode({ id: user._id, username: user.username }, this.JWT_KEY),
        user: {
          id: user._id,
          name: user.name,
          academicYear: user.academicYear
        }
      }
    }
    return false
  }
}
