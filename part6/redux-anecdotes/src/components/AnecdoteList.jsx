import { useDispatch, useSelector } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { handleNotification } from '../reducers/notificationReducer'
import PropTypes from 'prop-types'

const Anecdote = ({ anecdote, voteClick }) => {
  return (
    <div>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={voteClick}>vote</button>
      </div>
    </div>
  )
}

Anecdote.propTypes = {
  anecdote: PropTypes.object,
  voteClick: PropTypes.func
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => {
    if (state.filter === 'ALL') {
      return state.anecdotes
    } else {
      return state.anecdotes.filter(a => a.content.toLowerCase().includes(state.filter.toLowerCase()))
    }
  })

  const handleVoteClick = (anecdote) => {
    dispatch(vote(anecdote))
    dispatch(handleNotification(`you voted '${anecdote.content}'`, 5))
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          voteClick={ () => handleVoteClick(anecdote)
          }
        />
      )}
    </div>
  )
}

export default AnecdoteList