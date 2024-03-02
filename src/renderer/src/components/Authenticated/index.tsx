import { useAuth } from '@/contexts/AuthProvider'

import { Navigate, Outlet } from 'react-router-dom'
import { Navbar } from '../Navbar'

export const Authenticated: React.FC = () => {
  const { isLoggedIn } = useAuth()

  return isLoggedIn ? (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Outlet />
    </div>
  ) : (
    <Navigate to={'/login'} />
  )
}
