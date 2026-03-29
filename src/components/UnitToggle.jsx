import { Button, Stack, Typography } from '@mui/material'

function UnitToggle({ temperatureUnit, onUnitChange }) {
  // Unit switcher buttons
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} alignItems="center">
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Temperature unit
      </Typography>

      <Stack direction="row" spacing={1}>
        <Button
          variant={temperatureUnit === 'celsius' ? 'contained' : 'outlined'}
          onClick={() => onUnitChange('celsius')}
        >
          Celsius
        </Button>

        <Button
          variant={temperatureUnit === 'fahrenheit' ? 'contained' : 'outlined'}
          onClick={() => onUnitChange('fahrenheit')}
        >
          Fahrenheit
        </Button>
      </Stack>
    </Stack>
  )
}

export default UnitToggle