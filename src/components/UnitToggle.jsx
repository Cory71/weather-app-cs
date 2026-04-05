import { Button, Stack, Typography } from '@mui/material'

// Temperature unit toggle
function UnitToggle({ temperatureUnit, onUnitChange }) {
  // Unit switcher buttons
  return (
    <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1.25} alignItems={{ xs: 'stretch', lg: 'center' }} sx={{ minWidth: 0 }}>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Temperature unit
      </Typography>

      {/* Toggle buttons */}
      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ justifyContent: 'flex-start', minWidth: 0 }}> {/* Wrap on smaller widths so the buttons stay readable. */}
        <Button
          variant={temperatureUnit === 'celsius' ? 'contained' : 'outlined'}
          onClick={() => onUnitChange('celsius')}
          sx={{ minWidth: 104 }}
        >
          Celsius
        </Button>

        <Button
          variant={temperatureUnit === 'fahrenheit' ? 'contained' : 'outlined'}
          onClick={() => onUnitChange('fahrenheit')}
          sx={{ minWidth: 116 }}
        >
          Fahrenheit
        </Button>
      </Stack>
    </Stack>
  )
}

export default UnitToggle