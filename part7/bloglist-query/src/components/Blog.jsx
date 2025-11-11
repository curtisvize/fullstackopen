import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@mui/material'
import blogService from '../services/blogs'
import { useLogin } from '../LoginContext'
import { useBlogs } from '../hooks/index'

const Blog = () => {
  const [commentInput, setCommentInput] = useState('')
  const { id } = useParams()
  const { data, isLoading, isError } = useBlogs()
  const loggedInUser = useLogin()
  const queryClient = useQueryClient()

  const likeMutation = useMutation({
    mutationFn: (blog) => blogService.update(blog.id, blog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const removeMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const commentMutation = useMutation({
    mutationFn: ({ id, comment }) => blogService.addComment(id, { comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const handleLike = (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    likeMutation.mutate(updatedBlog)
  }

  const handleRemove = (blog) => {
    const confirmed = (window.confirm(`Remove blog ${blog.title} by ${blog.author}`))

    if (confirmed) {
      removeMutation.mutate(blog.id)
    }
  }

  const handleCommentChange = (event) => {
    setCommentInput(event.target.value)
  }

  const handleAddComment = (id, comment) => {
    console.log('handleAddComment comment:', comment)
    commentMutation.mutate({ id, comment })
    setCommentInput('')
  }

  if (isLoading) {
    return <div>loading data...</div>
  }

  if (isError) {
    return <div>blog service not available</div>
  }

  const blog = data.find(u => u.id === id)

  if (!blog) {
    return <div>blog not found</div>
  }

  const showRemove = loggedInUser.username === blog.user.username

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <div>{blog.url}</div>
      <div>{blog.likes} likes <Button size='small' variant='contained' onClick={() => handleLike(blog)}>like</Button></div>
      <div>added by {blog.user.name} {showRemove &&
        <Button size='small' variant='contained' onClick={() => handleRemove(blog)}>remove</Button>}
      </div>
      <div>
        <h3>comments</h3>
        <input type='text' value={commentInput} onChange={handleCommentChange} />
        <Button size='small' variant='contained' onClick={() => handleAddComment(blog.id, commentInput)}>add comment</Button>
      </div>
      { blog.comments &&
        <ul>
          { blog.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      }
    </div>
  )
}

export default Blog