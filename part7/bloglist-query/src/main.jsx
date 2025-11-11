import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router } from 'react-router-dom'
import { NotificationContextProvider } from './NotificationContext'
import App from './App'
import './App.css'
import { LoginContextProvider } from './LoginContext'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <QueryClientProvider client={queryClient}>
      <NotificationContextProvider>
        <LoginContextProvider>
          <App />
        </LoginContextProvider>
      </NotificationContextProvider>
    </QueryClientProvider>
  </Router>
)