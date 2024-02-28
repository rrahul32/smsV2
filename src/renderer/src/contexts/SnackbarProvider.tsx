import { Typography } from '@mui/material'
import Alert, { AlertColor } from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import React, { createContext, useContext, useState } from 'react'

interface SnackbarContextInterface {
  error: (newMessage: string) => void
  success: (newMessage: string) => void
  warning: (newMessage: string) => void
}

export const SnackbarContext = createContext({} as SnackbarContextInterface)

type SnackbarProviderProps = {
  children: React.ReactNode
}

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<AlertColor | undefined>(undefined)

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  const error = (newMessage: string) => {
    setMessage(newMessage ? newMessage : 'common.somethingWentWrong')
    setSeverity('error')
    setOpen(true)
  }

  const success = (newMessage: string) => {
    setMessage(newMessage)
    setSeverity('success')
    setOpen(true)
  }

  const warning = (newMessage: string) => {
    setMessage(newMessage)
    setSeverity('warning')
    setOpen(true)
  }

  return (
    <SnackbarContext.Provider value={{ error, success, warning }}>
      {children}
      <Snackbar
        key={message}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={severity}>
          <Typography variant="body1">{message}</Typography>
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}

export function useSnackbar() {
  return useContext(SnackbarContext)
}
