import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import Select from 'react-select'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = ({ show, token, setError }) => {
  const [ born, setBorn ] = useState('')
  const [ author, setAuthor ] = useState(null)
  const result = useQuery(ALL_AUTHORS)
  const [ changeBorn ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })

  const submit = async (event) => {
    event.preventDefault()

    changeBorn({ variables: { name: author.value, born: parseInt(born) } })

    setAuthor(null)
    setBorn('')
  }

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const authors = result.data.allAuthors
  const selectOptions = authors.map(a => ({ value: a.name, label: a.name }))

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      { token &&
        <div>
          <h3>Set birthyear</h3>
          <form onSubmit={submit}>
            <div>
              <Select options={selectOptions} onChange={setAuthor} defaultValue={author} />
            </div>
            <div>
              born
              <input
                value={born}
                onChange={({ target }) => setBorn(target.value)}
              />
            </div>
            <button type="submit">update author</button>
          </form>
        </div>
      }
    </div>
  )
}

export default Authors
