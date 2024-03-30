export type UserInfo = {
  id: string
  name: string
  academicYear: number
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

export type User = {
  _id: string
  name: string
  username: string
  password: string
  academicYear: number
}
