import { CircularProgress, Stack, Typography } from '@mui/material'

// Loading spinner component
function LoadingSpinner({ isLoading }) {
  // Loading state display
  if (!isLoading) {
    return null
  }

  return (
    <Stack spacing={1.5} alignItems="center" sx={{ py: 2.5 }}>
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">
        Loading weather details for your selected city...
      </Typography>
    </Stack>
  )
}

export default LoadingSpinner