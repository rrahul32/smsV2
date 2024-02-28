import { useAuth } from '@/contexts/AuthProvider'

import { Navigate, Outlet } from 'react-router-dom'

export const Authenticated: React.FC = () => {
  const { isLoggedIn } = useAuth()

  return isLoggedIn ? <Outlet /> : <Navigate to={'/login'} />
}
