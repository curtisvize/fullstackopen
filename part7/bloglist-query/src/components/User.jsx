import { useParams } from 'react-router-dom'
import { useUsers } from '../hooks/index'

const User = () => {
  const { id } = useParams()
  const { data, isLoading, isError } = useUsers()

  if (isLoading) {
    return <div>loading data...</div>
  }

  if (isError) {
    return <div>user service not available</div>
  }

  const user = data.find(u => u.id === id)

  if (!user) {
    return <div>user not found</div>
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User