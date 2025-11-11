import { useState } from 'react'
import { TextField, Button } from '@mui/material'
import { useNotify } from '../NotificationContext'
import { useLoginDispatch } from '../LoginContext'
import Notification from './Notification'


const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const notifyWith = useNotify()
  const { login } = useLoginDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      await login({ username, password })
      setUsername('')
      setPassword('')
    } catch (exception) {
      notifyWith({ message: 'Wrong credentials', type: 'error' })
    }
  }

  return (
    <div>
      <h2>log in to application</h2>
      <Notification />
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label="username"
            data-testid='username'
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <TextField
            label="password"
            data-testid='password'
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <Button variant="contained" color="primary" type="submit">login</Button>
      </form>
    </div>
  )
}

export default LoginForm