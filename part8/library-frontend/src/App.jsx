import { useState } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Recommended from './components/Recommended'
import LoginForm from './components/LoginForm'
import Notify from './components/Notify'
import { BOOK_ADDED, ALL_BOOKS } from './queries'

const updateCache = (cache, query, addedBook) => {
  const uniqByName = (array) => {
    let seen = new Set()
    return array.filter((item) => {
      let key = item.title
      return seen.has(key) ? false : seen.add(key)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook))
    }
  })
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const client = useApolloClient()

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const logout = () => {
    setPage('authors')
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      notify(`${addedBook.title} added`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    }
  })

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        { token && (
          <span>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommended')}>recommended</button>
          </span>
        )}
        { token ? 
          <button onClick={logout}>logout</button> :
          <button onClick={() => setPage('login')}>login</button>
        }
      </div>
      <Notify errorMessage={errorMessage} />

      <Authors show={page === 'authors'} setError={notify} token={token} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} setError={notify} setPage={setPage} />

      <Recommended show={page === 'recommended'} />

      <LoginForm show={page === 'login'} setError={notify} setToken={setToken} setPage={setPage} />
    </div>
  )
}

export default App
