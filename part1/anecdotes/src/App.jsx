import { useState } from 'react'

const Button = ({ text, onClick }) => <button onClick={onClick}>{text}</button>

const AnecdoteOfTheDay = (props) => {
  return (
    <div>
      <h1>Anecdote of the day</h1>
      {props.anecdotes[props.selected]}<br/>
      has {props.votes[props.selected]} votes<br/>
      <Button onClick={props.handleVoteClick} text='vote' />
      <Button onClick={props.handleNextAnecdoteClick} text='next anecdote' />
    </div>
  )
}

const MostVotes = ({ total, anecdotes, votes, mostVotes }) => {
  if (total === 0) {
    return (
      <p>No votes yet</p>
    )
  }
  return (
    <p>{anecdotes[mostVotes]}<br/>
    has {votes[mostVotes]} votes</p>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
  const [total, setTotal] = useState(0)
  const mostVotes = votes.indexOf(Math.max(...votes))
  const handleNextAnecdoteClick = () => setSelected(Math.floor(Math.random() * anecdotes.length))

  const handleVoteClick = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
    setTotal(total + 1)
  }

  return (
    <div>
      <AnecdoteOfTheDay
        anecdotes={anecdotes}
        selected={selected}
        votes={votes}
        handleVoteClick={handleVoteClick}
        handleNextAnecdoteClick={handleNextAnecdoteClick}
      />
      <div>
        <h1>Anecdote with most votes</h1>
        <MostVotes 
          total={total}
          anecdotes={anecdotes}
          votes={votes}
          mostVotes={mostVotes}
        />
      </div>
    </div>
  )
}

export default App
