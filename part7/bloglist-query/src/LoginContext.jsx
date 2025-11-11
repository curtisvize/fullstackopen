import { createContext, useReducer, useContext, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'

const loginReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return action.payload
    case 'LOGOUT':
      return null
    default:
      return state
  }
}

const LoginContext = createContext()

export const LoginContextProvider = (props) => {
  const [user, dispatch] = useReducer(loginReducer, null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch({ type: 'LOGIN', payload: user })
      blogService.setToken(user.token)
    }
  }, [])

  return (
    <LoginContext.Provider value={ [user, dispatch] }>
      {props.children}
    </LoginContext.Provider>
  )
}

export const useLogin = () => {
  const [user] = useContext(LoginContext)
  return user
}

export const useLoginDispatch = () => {
  const [, dispatch] = useContext(LoginContext)

  return {
    login: async (credentials) => {
      const user = await loginService.login(credentials)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      return dispatch({ type: 'LOGIN', payload: user })
    },
    logout: () => {
      window.localStorage.removeItem('loggedBlogappUser')
      dispatch({ type: 'LOGOUT' })
    }
  }
}