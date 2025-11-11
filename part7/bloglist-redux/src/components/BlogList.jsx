import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Notification from './Notification'
import Blog from './Blog'
import BlogForm from './BlogForm'
import Toggleable from './Toggleable'
import { logout } from '../reducers/userReducer'
import {
  initializeBlogs,
  createBlog,
  remove,
  like,
} from '../reducers/blogReducer'

const BlogList = () => {
  const user = useSelector((state) => state.user)
  const blogs = useSelector((state) => state.blogs)
  const blogFormRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    dispatch(createBlog(blogObject))
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  const handleLike = (id) => {
    const blog = blogs.find((b) => b.id === id)
    dispatch(like(blog))
  }

  const handleRemove = (id) => {
    const blogToRemove = blogs.find((b) => b.id === id)
    const confirmed = window.confirm(
      `Remove blog ${blogToRemove.title} by ${blogToRemove.author}`,
    )

    if (confirmed) {
      dispatch(remove(id))
    }
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name} is logged in <button onClick={handleLogout}>logout</button>
      </p>
      <Toggleable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Toggleable>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          like={() => handleLike(blog.id)}
          remove={() => handleRemove(blog.id)}
          username={user.username}
        />
      ))}
    </div>
  )
}

export default BlogList
