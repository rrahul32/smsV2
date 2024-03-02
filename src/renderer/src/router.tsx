import { Authenticated, ErrorPage, UnAuthenticated } from '@/components'
import Login from '@/pages/Login'
import StudentList from '@/pages/StudentList'
import { createBrowserRouter } from 'react-router-dom'
import AddStudent from './pages/AddStudent'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Authenticated />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/students',
        element: <StudentList />
      },
      {
        path: '/students/add',
        element: <AddStudent />
      }
    ]
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