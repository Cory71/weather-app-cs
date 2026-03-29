import { Card, CardContent, Stack, Typography } from '@mui/material'

function getForecastMessage(selectedCity, forecastData) {
  // Placeholder message text
  if (!selectedCity) {
    return 'Your five-day forecast will show here after you search for a city.'
  }

  if (!forecastData.length) {
    return 'Forecast cards will be added in Phase 3 and Phase 4.'
  }

  return 'Forecast entries are ready.'
}

function ForecastList({ forecastData, selectedCity }) {
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
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ForecastList