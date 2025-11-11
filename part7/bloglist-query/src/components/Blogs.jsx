import { useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import BlogForm from './BlogForm'
import Toggleable from './Toggleable'
import blogService from '../services/blogs'
import { useNotify } from '../NotificationContext'
import { useBlogs } from '../hooks/index.js'

const Blogs = () => {
  const blogFormRef = useRef()
  const queryClient = useQueryClient()
  const notifyWith = useNotify()
  const { data, isLoading, isError } = useBlogs()

  const addMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (blog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      notifyWith({
        message: `a new blog ${blog.title} by ${blog.author} added`,
        type: 'success'
      })
    }
  })

  const addBlog = (newBlog) => {
    blogFormRef.current.toggleVisibility()
    addMutation.mutate(newBlog)
  }

  if (isLoading) {
    return <div>loading data...</div>
  }

  if (isError) {
    return (
      <div>
        blog service not available
      </div>
    )
  }

  const blogs = data.sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <Toggleable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Toggleable>
      {blogs.map((blog) => (
        <div key={blog.id} className='blog-style'>
          <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
        </div>
      ))}
    </div>
  )
}

export default Blogs