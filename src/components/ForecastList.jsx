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

// Rain chance helper
function formatPrecipitationChance(popValue) {
  if (popValue == null) {
    return '--'
  }

  return `${Math.round(popValue * 100)}%`
}

// Rain or snow amount
function formatRainOrSnowAmount(forecastItem, temperatureUnit) {
  const rainVolume = forecastItem.rain?.['3h']
  const snowVolume = forecastItem.snow?.['3h']

  if (rainVolume == null && snowVolume == null) {
    return '' // Do not show this line if there is no amount.
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

// High and low helper
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

// Forecast icon helper
function getWeatherIconUrl(iconCode) {
  if (!iconCode) {
    return ''
  }

  return `https://openweathermap.org/img/wn/${iconCode}.png`
}

// Check for forecast rows
function hasForecastItems(forecastData) {
  return forecastData.length > 0
}

function ForecastList({ forecastData, forecastEntries, selectedCity, temperatureUnit }) {
  // Forecast card
  return (
    <Card
      elevation={0}
      sx={{
        minWidth: 0,
        borderRadius: { xs: 3, sm: 4 },
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.75, lg: 2.5 } }}>
        <Stack spacing={{ xs: 1.5, lg: 1.2 }}>
          {/* Title text */}
          <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '1.6rem', lg: '1.85rem' } }}>
            Forecast
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {selectedCity || 'Choose a city to set up the forecast section.'}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Five-day forecast
          </Typography>

          {/* Forecast items */}
          {hasForecastItems(forecastData)
            ? forecastData.map((forecastItem) => (
                <ForecastRow
                  key={forecastItem.dt}
                  forecastItem={forecastItem}
                  forecastEntries={forecastEntries}
                  temperatureUnit={temperatureUnit}
                />
              ))
            : null}
        </Stack>
      </CardContent>
    </Card>
  )
}

// One forecast row
function ForecastRow({ forecastItem, forecastEntries, temperatureUnit }) {
  const precipitationAmountLabel = formatRainOrSnowAmount(forecastItem, temperatureUnit)

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 2.5 },
        py: { xs: 1.25, sm: 1.35, lg: 1.1 },
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: { xs: 2.5, sm: 3 },
        backgroundColor: 'action.hover',
      }}
    >
      {/* Forecast row content */}
      <Box
        sx={{
          display: 'grid',
          gap: { xs: 0.9, sm: 1, lg: 0.8 },
          gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) minmax(0, 1fr) auto' },
          alignItems: 'center',
          minWidth: 0, // Let the row shrink on smaller screens.
        }}
      >
        <Stack spacing={0.3}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {formatForecastDate(forecastItem.dt_txt)}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Precipitation chance: {formatPrecipitationChance(forecastItem.pop)}
          </Typography>

          {precipitationAmountLabel ? (
            <Typography variant="body2" color="text.secondary">
              {precipitationAmountLabel}
            </Typography>
          ) : null}
        </Stack>

        <Stack spacing={0.3} sx={{ minWidth: 0 }}>
          <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize', overflowWrap: 'anywhere' }}>
            {forecastItem.weather?.[0]?.description || 'Forecast pending'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {getDailyHighLowLabel(forecastItem, forecastEntries, temperatureUnit)}
          </Typography>
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
          {forecastItem.weather?.[0]?.icon ? (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: { xs: 32, sm: 36, lg: 34 },
                height: { xs: 32, sm: 36, lg: 34 },
                borderRadius: '50%',
                background: 'linear-gradient(180deg, rgba(30, 136, 200, 0.18) 0%, rgba(245, 250, 255, 0.98) 100%)',
                border: '1px solid',
                borderColor: 'rgba(30, 136, 200, 0.18)',
                boxShadow: '0 4px 10px rgba(23, 50, 74, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.82)', // Helps the icon stand out.
                flexShrink: 0,
              }}
            >
              <Box
                component="img"
                src={getWeatherIconUrl(forecastItem.weather[0].icon)}
                alt={forecastItem.weather?.[0]?.description || 'Forecast icon'}
                sx={{
                  width: '100%',
                  height: '100%',
                  filter: 'drop-shadow(0 1px 2px rgba(23, 50, 74, 0.3)) contrast(1.05)',
                }}
              />
            </Box>
          ) : null}
        </Box>
      </Box>
    </Box>
  )
}

export default ForecastList