import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material'
import { useUsers } from '../hooks/index'

const UserRow = ({ user }) => (
  <TableRow>
    <TableCell><Link to={`/users/${user.id}`}>{user.name}</Link></TableCell>
    <TableCell>{user.blogs.length}</TableCell>
  </TableRow>
)

const Users = () => {
  const { data, isLoading, isError } = useUsers()

  if (isLoading) {
    return <div>loading data...</div>
  }

  if (isError) {
    return (
      <div>
        user service not available
      </div>
    )
  }

  const users = data.sort((a, b) => b.blogs.length - a.blogs.length)

  return (
    <div>
      <h2>Users</h2>

      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>blogs created</TableCell>
            </TableRow>
            {users.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Users