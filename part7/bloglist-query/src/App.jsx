import { Route, Routes } from 'react-router-dom'
import { Container, CssBaseline } from '@mui/material'
import { useLogin } from './LoginContext'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Blogs from './components/Blogs'
import Blog from './components/Blog'
import Users from './components/Users'
import User from './components/User'
import Menu from './components/Menu'

const ApplicationView = () => {

  return (
    <Container>
      <Menu />
      <h2>blogs</h2>
      <Notification />
      <Routes>
        <Route path='/blogs/:id' element={<Blog />} />
        <Route path='/users/:id' element={<User />} />
        <Route path='/users' element={<Users />} />
        <Route path='/' element={<Blogs />} />
      </Routes>
    </Container>
  )
}

const App = () => {
  const loggedInUser = useLogin()

  return <div><CssBaseline />{loggedInUser === null ? <LoginForm /> : <ApplicationView />}</div>
}

export default App