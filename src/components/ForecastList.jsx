import { Box, Card, CardContent, Stack, Typography } from '@mui/material'

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

// Precipitation helpers
function formatPrecipitationChance(popValue) {
  if (popValue == null) {
    return '--'
  }

  return `${Math.round(popValue * 100)}%`
}

// Precipitation amount helper
function formatRainOrSnowAmount(forecastItem, temperatureUnit) {
  const rainVolume = forecastItem.rain?.['3h']
  const snowVolume = forecastItem.snow?.['3h']

  if (rainVolume == null && snowVolume == null) {
    return '' // Hide this line when the API has no rain or snow amount.
  }

  const precipitationVolume = rainVolume ?? snowVolume
  const precipitationLabel = rainVolume != null ? 'Rain' : 'Snow'

  if (temperatureUnit === 'fahrenheit') {
    const inches = precipitationVolume / 25.4
    return `${precipitationLabel}: ${inches.toFixed(2)} in`
  }

  return `${precipitationLabel}: ${precipitationVolume.toFixed(1)} mm`
}

// Date key helper
function getCityDateKey(unixTime) {
  if (unixTime == null) {
    return ''
  }

  return new Date(unixTime * 1000).toISOString().slice(0, 10)
}

// Daily range helper
function getDailyHighLowLabel(forecastItem, forecastEntries, temperatureUnit) {
  const cityDateKey = getCityDateKey(forecastItem.dt)
  const sameDayForecastEntries = forecastEntries.filter((entry) => getCityDateKey(entry.dt) === cityDateKey)

  const dailyTemperatures = []

  sameDayForecastEntries.forEach((entry) => {
    if (entry.main?.temp_min != null) {
      dailyTemperatures.push(entry.main.temp_min)
    }

    if (entry.main?.temp_max != null) {
      dailyTemperatures.push(entry.main.temp_max)
    }
  })

  if (!dailyTemperatures.length) {
    return '--'
  }

  const highTemperature = Math.max(...dailyTemperatures)
  const lowTemperature = Math.min(...dailyTemperatures)

  return `H ${formatTemperature(highTemperature, temperatureUnit)} / L ${formatTemperature(lowTemperature, temperatureUnit)}`
}

// Icon helper
function getWeatherIconUrl(iconCode) {
  if (!iconCode) {
    return ''
  }

  return `https://openweathermap.org/img/wn/${iconCode}.png`
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

function ForecastList({ forecastData, forecastEntries, selectedCity, temperatureUnit }) {
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
            <ForecastRow
              key={forecastItem.dt}
              forecastItem={forecastItem}
              forecastEntries={forecastEntries}
              temperatureUnit={temperatureUnit}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}

// Forecast row component
function ForecastRow({ forecastItem, forecastEntries, temperatureUnit }) {
  const precipitationAmountLabel = formatRainOrSnowAmount(forecastItem, temperatureUnit)

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      sx={{ py: 1, borderTop: '1px solid', borderColor: 'divider' }}
    >
      {/* Forecast date and extras */}
      <Stack spacing={0.25}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {formatForecastDate(forecastItem.dt_txt)}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Precipitation chance: {formatPrecipitationChance(forecastItem.pop)}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {getDailyHighLowLabel(forecastItem, forecastEntries, temperatureUnit)}
        </Typography>

        {precipitationAmountLabel ? (
          <Typography variant="body2" color="text.secondary">
            {precipitationAmountLabel}
          </Typography>
        ) : null}
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        {forecastItem.weather?.[0]?.icon ? (
          <Box
            component="img"
            src={getWeatherIconUrl(forecastItem.weather[0].icon)}
            alt={forecastItem.weather?.[0]?.description || 'Forecast icon'}
            sx={{ width: 36, height: 36 }}
          />
        ) : null}

        <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
          {forecastItem.weather?.[0]?.description || 'Forecast pending'}
        </Typography>
      </Stack>

      <Typography variant="body2" color="text.secondary">
        {forecastItem.main ? formatTemperature(forecastItem.main.temp, temperatureUnit) : '--'}
      </Typography>
    </Stack>
  )
}

export default ForecastList