import { Card, CardContent, Chip, Stack, Typography } from '@mui/material'

function getWeatherMessage(selectedCity, weatherData) {
  // Placeholder message text
  if (!selectedCity) {
    return 'Search for a city to prepare the current weather panel.'
  }

  if (!weatherData) {
    return 'Current weather data will appear here after the API work in Phase 3.'
  }

  return 'Weather details are ready.'
}

function WeatherCard({ selectedCity, temperatureUnit, weatherData }) {
  const unitLabel = temperatureUnit === 'celsius' ? 'Celsius' : 'Fahrenheit'
  const message = getWeatherMessage(selectedCity, weatherData)

  // Current weather panel
  return (
    <Card elevation={0} sx={{ height: '100%', borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
          >
            <div>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Current Weather
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedCity || 'No city selected yet'}
              </Typography>
            </div>

            <Chip label={unitLabel} color="primary" variant="outlined" />
          </Stack>

          <Typography variant="body1" color="text.secondary">
            {message}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default WeatherCard