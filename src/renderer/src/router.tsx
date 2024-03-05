import { Authenticated, ErrorPage, UnAuthenticated } from '@/components'
import Login from '@/pages/Login'
import StudentList from '@/pages/StudentList'
import { createBrowserRouter } from 'react-router-dom'
import AddStudent from './pages/AddStudent'
import DueList from './pages/DueList'
import MakePayment from './pages/MakePayment'
import PaymentList from './pages/PaymentList'

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
      },
      {
        path: '/students/due-list',
        element: <DueList />
      },
      {
        path: '/payments/new',
        element: <MakePayment />
      },
      {
        path: '/payments',
        element: <PaymentList />
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
