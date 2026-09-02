import { Button } from '@mui/material'

// Button that fills the search box with the detected city
function LocationButton({ isDetecting, isDisabled, onUseMyLocation }) {
  return (
    <Button
      variant="outlined"
      size="large"
      onClick={onUseMyLocation}
      disabled={isDisabled}
      sx={{ minHeight: 56, px: 3, width: '100%', whiteSpace: 'nowrap' }} // Match the search field height.
    >
      {isDetecting ? 'Detecting...' : '📍 Use my location'}
    </Button>
  )
}

export default LocationButton
