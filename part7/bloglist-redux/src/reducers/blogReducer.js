import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { handleNotification } from './notificationReducer'

const sortByLikes = (blogs) => {
  return blogs.sort((a, b) => b.likes - a.likes)
}

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    updateLikes(state, action) {
      const id = action.payload.id
      return sortByLikes(state.map((b) => (b.id !== id ? b : action.payload)))
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    removeBlog(state, action) {
      const id = action.payload
      return sortByLikes(state.filter((b) => b.id !== id))
    },
    setBlogs(state, action) {
      return action.payload
    },
  },
})

export const { updateLikes, appendBlog, removeBlog, setBlogs } =
  blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blog)
    dispatch(appendBlog(newBlog))
    dispatch(
      handleNotification(
        `a new blog ${newBlog.title} by ${newBlog.author} added`,
        'confirmation',
        5,
      ),
    )
  }
}

export const like = (blog) => {
  return async (dispatch) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    const responseBlog = await blogService.update(blog.id, updatedBlog)
    dispatch(updateLikes(responseBlog))
  }
}

export const remove = (id) => {
  return async (dispatch) => {
    const removedBlog = await blogService.remove(id)
    dispatch(removeBlog(id))
  }
}

export default blogSlice.reducer
