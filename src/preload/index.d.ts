import { LoginInfo, LoginParams, LogoutParams } from '@/types'

declare global {
  interface Window {
    context: {
      reconnect: () => Promise<boolean>
      login: (params: LoginParams) => Promise<LoginInfo>
      logout: (params: LogoutParams) => Promise<boolean>
    }
  }
}
