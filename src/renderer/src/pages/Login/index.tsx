import { useAuth, useSnackbar } from '@/contexts'
import { Button, TextField } from '@mui/material'
import { useState } from 'react'

function Login() {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const { login } = useAuth()
  const { success, error } = useSnackbar()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    login({
      username,
      password
    }).finally(() => setLoading(false))
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-400 to-pink-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Login</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="transition-opacity duration-300 ease-in-out hover:opacity-80 focus-within:opacity-80">
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
              }}
              variant="outlined"
              size="small"
              color="secondary"
              className="bg-gray-100"
            />
          </div>
          <div className="transition-opacity duration-300 ease-in-out hover:opacity-80 focus-within:opacity-80">
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              value={password}
              size="small"
              type="password"
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              color="secondary"
              className="bg-gray-100"
            />
          </div>
          <div className="transition duration-300 ease-in-out hover:opacity-80 focus-within:opacity-80 flex justify-center">
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              className="w-full md:w-auto"
            >
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
