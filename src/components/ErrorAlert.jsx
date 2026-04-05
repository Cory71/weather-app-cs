import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

// Error alert component
function ErrorAlert({ message }) {
  // Error message display
  if (!message) {
    return null
  }

  return (
    <Alert severity="error" variant="filled">
      <AlertTitle>Weather request issue</AlertTitle>
      {message}
    </Alert>
  )
}

export default ErrorAlert