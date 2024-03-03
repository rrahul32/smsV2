import { LoginParams, LogoutParams } from '@shared/types'

export const login = (params: LoginParams) => {
  return window.context.login(params)
}

export const logout = (params: LogoutParams) => {
  return window.context.logout(params)
}
