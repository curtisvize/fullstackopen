import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  message: null
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      state.message = action.payload
    },
    clearNotification(state) {
      state.message = null
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions

export const handleNotification = (message, seconds) => {
  return dispatch => {
    dispatch(setNotification(message))

    setTimeout(() => {
      dispatch(clearNotification())
    }, seconds * 1000)
  }
}
export default notificationSlice.reducer