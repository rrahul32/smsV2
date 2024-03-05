import { useAuth } from '@/contexts'
import { ArrowDropDown } from '@mui/icons-material'
import { Menu, MenuItem } from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export const Navbar = () => {
  const { logout } = useAuth()
  const [studentsAnchorEl, setStudentsAnchorEl] = useState(null)
  const [paymentsAnchorEl, setPaymentsAnchorEl] = useState(null)

  const handleStudentsClick = (event) => {
    setStudentsAnchorEl(event.currentTarget)
  }

  const handlePaymentsClick = (event) => {
    setPaymentsAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setStudentsAnchorEl(null)
    setPaymentsAnchorEl(null)
  }

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white text-xl font-bold">
              Student Manager
            </Link>
          </div>
          <div className="flex items-center">
            <div className="ml-4 flex items-center">
              <button
                onClick={handleStudentsClick}
                className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none"
              >
                Students
                <ArrowDropDown />
              </button>
              <Menu
                anchorEl={studentsAnchorEl}
                open={Boolean(studentsAnchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  style: {
                    backgroundColor: '#1E293B',
                    color: 'white'
                  }
                }}
              >
                <MenuItem onClick={handleMenuClose}>
                  <Link to="/students" className="text-white">
                    View Students
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Link to="/students/add" className="text-white">
                    Add Student
                  </Link>
                </MenuItem>
              </Menu>
              <button
                onClick={handlePaymentsClick}
                className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none"
              >
                Payments
                <ArrowDropDown />
              </button>
              <Menu
                anchorEl={paymentsAnchorEl}
                open={Boolean(paymentsAnchorEl)}
                onClose={handleMenuClose}
                slotProps={{
                  paper: {
                    style: {
                      backgroundColor: '#1E293B',
                      color: 'white'
                    }
                  }
                }}
              >
                <MenuItem onClick={handleMenuClose}>
                  <Link to="/payments" className="text-white">
                    View Payments
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Link to="/payments/new" className="text-white">
                    New Payment
                  </Link>
                </MenuItem>
              </Menu>
              <button
                onClick={logout}
                className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
