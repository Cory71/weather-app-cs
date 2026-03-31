import { Card, CardContent, Stack, Typography } from '@mui/material'

// Temperature helpers
function convertTemperature(celsiusValue, temperatureUnit) {
  if (temperatureUnit === 'fahrenheit') {
    return (celsiusValue * 9) / 5 + 32
  }

  return celsiusValue
}

function formatTemperature(celsiusValue, temperatureUnit) {
  const convertedValue = convertTemperature(celsiusValue, temperatureUnit)
  const unitSymbol = temperatureUnit === 'celsius' ? 'C' : 'F'

  return `${Math.round(convertedValue)}°${unitSymbol}`
}

// Date helper
function formatForecastDate(dateText) {
  if (!dateText) {
    return 'Date unavailable'
  }

  return new Date(dateText).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

// Forecast text helper
function getForecastMessage(selectedCity, forecastData) {
  if (!selectedCity) {
    return 'Your five-day forecast will show here after you search for a city.'
  }

  if (!forecastData.length) {
    return 'Forecast data will appear here after the request finishes.'
  }

  return 'Five forecast points are loaded for the current city.'
}

function ForecastList({ forecastData, selectedCity, temperatureUnit }) {
  // Forecast display values
  const message = getForecastMessage(selectedCity, forecastData)

  // Forecast panel
  return (
    <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Forecast Preview
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {selectedCity || 'Choose a city to set up the forecast section.'}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {message}
          </Typography>

          {forecastData.map((forecastItem) => (
            <Stack
              key={forecastItem.dt}
              direction={{ xs: 'column', sm: 'row' }}
              spacing={0.75}
              justifyContent="space-between"
              sx={{ py: 1, borderTop: '1px solid', borderColor: 'divider' }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {formatForecastDate(forecastItem.dt_txt)}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                {forecastItem.weather?.[0]?.description || 'Forecast pending'}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {forecastItem.main ? formatTemperature(forecastItem.main.temp, temperatureUnit) : '--'}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ForecastList