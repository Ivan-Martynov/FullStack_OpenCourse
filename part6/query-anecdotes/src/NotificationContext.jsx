import { createContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SUCCESS':
      state = { message: action.payload, class: 'success' }
      return state
    case 'FAILURE':
      state = { message: action.payload, class: 'failure' }
      return state
    case 'RESET':
      state = { message: '', class: 'success' }
      return state
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, {
    message: '',
    class: 'success',
  })

  return (
    <NotificationContext.Provider
      value={{ notification, notificationDispatch }}
    >
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
