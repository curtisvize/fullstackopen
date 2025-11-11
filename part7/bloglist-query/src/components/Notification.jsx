import { Alert } from '@mui/material'
import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()

  return (
    <div>
      {notification && (
        <Alert severity={notification.type}>{notification.message}</Alert>
      )}
    </div>
  )
}

export default Notification