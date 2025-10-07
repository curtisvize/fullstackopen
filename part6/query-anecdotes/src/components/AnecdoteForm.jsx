import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      queryClient.setQueryData({ queryKey: ['anecdotes'] }, anecdotes.concat(newAnecdote))
    },
    onError: (e) => {
      const error = e.response.data.error
      notificationDispatch({
        type: 'SHOW',
        payload: error
      })

      setTimeout(() => {
        notificationDispatch({ type: 'HIDE' })
      }, 5000)
    }
  })

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
    notificationDispatch({
      type: 'SHOW',
      payload: `added anecdote '${content}'`, 
    })

    setTimeout(() => {
      notificationDispatch({ type: 'HIDE' })
    }, 5000)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={addAnecdote}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
