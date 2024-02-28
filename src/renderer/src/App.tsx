import { AuthProvider, SnackbarProvider } from '@/contexts'
import { Box, CircularProgress } from '@mui/material'
import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

const App: React.FC = () => {
  return (
    <React.Suspense
      fallback={
        <Box
          sx={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <SnackbarProvider>
        <AuthProvider>
          <RouterProvider router={router}></RouterProvider>
        </AuthProvider>
      </SnackbarProvider>
    </React.Suspense>
  )
}

export default App
