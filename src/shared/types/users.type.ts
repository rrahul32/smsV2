export type UserInfo = {
  id: string
  name: string
}

export type LoginInfo = {
  accessToken: string
  user: UserInfo
}

export type LoginParams = {
  username: string
  password: string
}

export type LogoutParams = {
  userId: string
  accessToken: string
}
