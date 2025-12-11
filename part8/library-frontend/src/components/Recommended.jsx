import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'

const Recommended = (props) => {
  const result = useQuery(ALL_BOOKS)
  const user = useQuery(ME)

  if (!props.show) {
    return null
  }

  if (result.loading || user.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks
  const favGenre = user.data.me.favoriteGenre
  const filteredBooks = favGenre ? books.filter(b => b.genres.includes(favGenre)) : books

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <b>{favGenre}</b></p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended