import { Link } from 'react-router-dom'
import { AppBar, Toolbar, IconButton, Button, Box } from '@mui/material'
import { useLogin, useLoginDispatch } from '../LoginContext'

const Menu = () => {
  const loggedInUser = useLogin()
  const { logout } = useLoginDispatch()

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu"></IconButton>
        <Button color="inherit" component={Link} to="/">blogs</Button>
        <Button color="inherit" component={Link} to="/users">users</Button>
        <Box sx={{ flexGrow: 1 }} />
        <Box>
          {loggedInUser.name} is logged in <Button color="inherit" onClick={logout}>logout</Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Menu