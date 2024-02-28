import { login, logout } from '@/api'
import { useLocalStorage } from '@/hooks'
import { LoginParams, UserInfo } from '@shared/types'
import React, { createContext, useContext } from 'react'
import { useSnackbar } from './SnackbarProvider'

interface AuthContextInterface {
  login: (params: LoginParams) => Promise<boolean>
  logout: () => Promise<void>
  userInfo: UserInfo | null
  accessToken: string | null
  isLoggedIn: boolean
}

export const AuthContext = createContext({} as AuthContextInterface)

type AuthProviderProps = {
  children?: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const snackbar = useSnackbar()

  const [accessToken, setAccessToken] = useLocalStorage<string | null>('accessToken', null)

  const [userInfo, setUserInfo] = useLocalStorage<UserInfo | null>('userInfo', null)

  const handleLogin = async (params: LoginParams) => {
    return login(params)
      .then((res) => {
        snackbar.success('Login Successful')
        setAccessToken(res.accessToken)
        setUserInfo(res.user)
        return true
      })
      .catch((e) => {
        snackbar.error(e.message)
        return false
      })
  }

  const handleLogout = async () => {
    if (accessToken && userInfo) {
      logout({
        accessToken,
        userId: userInfo.id
      }).catch((e) => {
        console.log('🚀 ~ handleLogout ~ e:', e.message)
      })
    }
    setAccessToken(null)
    setUserInfo(null)
    snackbar.success('Logged out successfully')
  }

  return (
    <AuthContext.Provider
      value={{
        login: handleLogin,
        logout: handleLogout,
        userInfo,
        accessToken,
        isLoggedIn: !!(accessToken && userInfo && userInfo.id)
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
