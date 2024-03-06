import { login } from '@/api'
import { LoginParams, UserInfo } from '@shared/types'
import React, { createContext, useContext, useState } from 'react'
import { useSnackbar } from './SnackbarProvider'

interface AuthContextInterface {
  login: (params: LoginParams) => Promise<boolean>
  logout: () => Promise<void>
  userInfo: UserInfo | null
  accessToken: string | null
  isLoggedIn: boolean
  isLoggingIn: boolean
}

export const AuthContext = createContext({} as AuthContextInterface)

type AuthProviderProps = {
  children?: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const snackbar = useSnackbar()

  const [accessToken, setAccessToken] = useState<string | null>(null)

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false)

  const handleLogin = async (params: LoginParams) => {
    setIsLoggingIn(true)
    return login(params)
      .then((res) => {
        if (res) {
          snackbar.success('Login Successful')
          setAccessToken(res.accessToken)
          setUserInfo(res.user)
        } else {
          snackbar.error('Invalid credentials')
        }
        return true
      })
      .catch((e) => {
        console.log('🚀 ~ handleLogin ~ e:', e.message)
        snackbar.error('Unable to login')
        return false
      })
      .finally(() => {
        setIsLoggingIn(false)
      })
  }

  const handleLogout = async () => {
    // if (accessToken && userInfo) {
    //   logout({
    //     accessToken,
    //     userId: userInfo.id
    //   }).catch((e) => {
    //     console.log('🚀 ~ handleLogout ~ e:', e.message)
    //   })
    // }
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
        isLoggedIn: !!(accessToken && userInfo && userInfo.id),
        isLoggingIn
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
