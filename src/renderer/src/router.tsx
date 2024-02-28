import { Authenticated, UnAuthenticated } from '@/components'
import { createBrowserRouter } from 'react-router-dom'
import Login from './pages/Login'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Authenticated />
  },
  {
    path: '/login',
    element: <UnAuthenticated />,
    children: [
      {
        path: '',
        element: <Login />
      }
    ]
  }
])
