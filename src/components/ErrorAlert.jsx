import Alert from '@mui/material/Alert'

function ErrorAlert({ message }) {
  // Error message display
  if (!message) {
    return null
  }

  return <Alert severity="warning">{message}</Alert>
}

export default ErrorAlert