import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'
import blogService from '../services/blogs'

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    retry: 1
  })
}

export const useBlogs = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    retry: 1
  })
}