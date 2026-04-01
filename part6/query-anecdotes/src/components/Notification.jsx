import { useContext } from 'react'
import NotificationContext from '../NotificationContext'

let notificationTimeout = null
const Notification = () => {
  const { notification, notificationDispatch } = useContext(NotificationContext)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
    color: notification.class === 'success' ? 'green' : 'red',
  }

  // clear previous timer
  clearTimeout(notificationTimeout)

  // start new timer
  notificationTimeout = setTimeout(() => {
    notificationDispatch({ type: 'RESET' })
  }, 5 * 1000)

  return notification.message && <div style={style}>{notification.message}</div>
}

export default Notification
