import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from '../services/anecdotes'

const sortByVotes = (anecdotes) => {
  return anecdotes.sort((a, b) => b.votes - a.votes)
}

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    updateVotes(state, action) {
      const id = action.payload.id
      return sortByVotes(state.map(a =>
        a.id !== id ? a : action.payload
      ))
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { updateVotes, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const vote = (anecdote) => {
  return async dispatch => {
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
    const responseAnecdote = await anecdoteService.update(updatedAnecdote)
    dispatch(updateVotes(responseAnecdote))
  }
}

export default anecdoteSlice.reducer