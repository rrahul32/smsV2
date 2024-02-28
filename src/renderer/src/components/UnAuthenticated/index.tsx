import { useAuth } from '@/contexts/AuthProvider'

import { Navigate, Outlet } from 'react-router-dom'

export const UnAuthenticated: React.FC = () => {
  const { isLoggedIn } = useAuth()

  return isLoggedIn ? <Navigate to={'/'} /> : <Outlet />
}
