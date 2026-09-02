import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

// Error alert component
function ErrorAlert({ message, title = 'Weather request issue' }) {
  // Error message display
  if (!message) {
    return null
  }

  return (
    <Alert severity="error" variant="filled">
      <AlertTitle>{title}</AlertTitle>
      {message}
    </Alert>
  )
}

export default ErrorAlert