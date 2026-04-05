import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material'

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

// Wind helpers
function formatWindSpeed(speedInMetersPerSecond, temperatureUnit) {
  if (temperatureUnit === 'fahrenheit') {
    const milesPerHour = speedInMetersPerSecond * 2.23694
    return `${Math.round(milesPerHour)} mph`
  }

  const kilometersPerHour = speedInMetersPerSecond * 3.6
  return `${Math.round(kilometersPerHour)} km/h`
}

function formatWindDirection(windDegrees) {
  if (windDegrees == null) {
    return 'Direction unavailable'
  }

  const compassDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const compassIndex = Math.round(windDegrees / 45) % compassDirections.length // Use 8 compass directions.

  return compassDirections[compassIndex]
}

// Visibility helper
function formatVisibility(visibilityInMeters, temperatureUnit) {
  if (visibilityInMeters == null) {
    return '--'
  }

  if (temperatureUnit === 'fahrenheit') {
    const visibilityInMiles = visibilityInMeters / 1609.344
    return `${visibilityInMiles.toFixed(1)} mi`
  }

  const visibilityInKilometers = visibilityInMeters / 1000
  return `${visibilityInKilometers.toFixed(1)} km`
}

// City name helper
function getLocationLabel(weatherData, selectedCity) {
  if (!weatherData) {
    return selectedCity || 'No city selected yet'
  }

  const countryCode = weatherData.sys?.country

  if (countryCode) {
    return `${weatherData.name}, ${countryCode}`
  }

  return weatherData.name || selectedCity
}

// Time helpers
function formatCityTime(unixTime, timezoneOffsetInSeconds) {
  if (unixTime == null || timezoneOffsetInSeconds == null) {
    return '--'
  }

  const cityTime = new Date((unixTime + timezoneOffsetInSeconds) * 1000)

  return cityTime.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC', // The API offset is already added above.
  })
}

function formatCityDateTime(unixTime, timezoneOffsetInSeconds) {
  if (unixTime == null || timezoneOffsetInSeconds == null) {
    return '--'
  }

  const cityTime = new Date((unixTime + timezoneOffsetInSeconds) * 1000)

  return cityTime.toLocaleString([], {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC', // The API offset is already added above.
  })
}

// Weather icon helper
function getWeatherIconUrl(iconCode) {
  if (!iconCode) {
    return ''
  }

  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}

function getWeatherMessage(selectedCity, weatherData) {
  if (!selectedCity) {
    return 'Search for a city to prepare the current weather panel.'
  }

  if (!weatherData) {
    return 'Current weather data will appear here after the request finishes.'
  }

  return weatherData.weather?.[0]?.description || 'Weather details are ready.'
}

// Build detail tiles
function getDetailItems(weatherData, temperatureUnit) {
  const windSpeedLabel = weatherData?.wind?.speed != null ? formatWindSpeed(weatherData.wind.speed, temperatureUnit) : '--'
  const windDirectionLabel = formatWindDirection(weatherData?.wind?.deg)
  const humidityLabel = weatherData?.main?.humidity != null ? `${weatherData.main.humidity}%` : '--'
  const visibilityLabel = formatVisibility(weatherData?.visibility, temperatureUnit)
  const cloudCoverageLabel = weatherData?.clouds?.all != null ? `${weatherData.clouds.all}%` : '--'
  const sunriseLabel = formatCityTime(weatherData?.sys?.sunrise, weatherData?.timezone)
  const sunsetLabel = formatCityTime(weatherData?.sys?.sunset, weatherData?.timezone)

  return [
    { label: 'Wind', value: `${windSpeedLabel} ${windDirectionLabel}` },
    { label: 'Humidity', value: humidityLabel },
    { label: 'Visibility', value: visibilityLabel },
    { label: 'Clouds', value: cloudCoverageLabel },
    { label: 'Sunrise', value: sunriseLabel },
    { label: 'Sunset', value: sunsetLabel },
  ]
}

// Small detail box
function WeatherDetailTile({ label, value }) {
  return (
    <Box
      sx={{
        px: { xs: 1.9, sm: 2, lg: 1.9 },
        py: { xs: 1.25, sm: 1.5, lg: 1.35 },
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: { xs: 2.5, sm: 3 },
        backgroundColor: 'action.hover',
      }}
    >
      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.2 }}>
        {value}
      </Typography>
    </Box>
  )
}

function WeatherCard({ selectedCity, temperatureUnit, weatherData }) {
  // Values to show in the card
  const unitLabel = temperatureUnit === 'celsius' ? 'Celsius' : 'Fahrenheit'
  const locationLabel = getLocationLabel(weatherData, selectedCity)
  const message = getWeatherMessage(selectedCity, weatherData)
  const temperatureLabel = weatherData?.main ? formatTemperature(weatherData.main.temp, temperatureUnit) : '--'
  const feelsLikeLabel = weatherData?.main ? formatTemperature(weatherData.main.feels_like, temperatureUnit) : '--'
  const localTimeLabel = formatCityDateTime(weatherData?.dt, weatherData?.timezone)
  const weatherIconUrl = getWeatherIconUrl(weatherData?.weather?.[0]?.icon)
  const weatherIconAlt = weatherData?.weather?.[0]?.description || 'Weather icon'
  const detailItems = getDetailItems(weatherData, temperatureUnit)

  // Current weather card
  return (
    <Card
      elevation={0}
      sx={{
        minWidth: 0,
        height: '100%',
        borderRadius: { xs: 3, sm: 4 },
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.75, lg: 2.5 } }}>
        <Stack spacing={{ xs: 2.25, sm: 2.6, lg: 2.1 }}>
          {/* Top text */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 1.5 }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
          >
            <div>
              <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '1.6rem', lg: '1.85rem' } }}>
                Current Weather
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locationLabel}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Local time: {localTimeLabel}
              </Typography>
            </div>

            <Chip label={unitLabel} color="primary" variant="outlined" size="small" />
          </Stack>

          {/* Main weather area */}
          <Box
            sx={{
              display: 'grid',
              gap: { xs: 1.5, sm: 2, lg: 1.5 },
              gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1.1fr) minmax(0, 0.9fr)' },
              alignItems: 'center',
              minWidth: 0,
            }}
          >
            <Stack spacing={0.75} alignItems={{ xs: 'center', md: 'flex-start' }} sx={{ textAlign: { xs: 'center', md: 'left' }, minWidth: 0 }}>
              <Typography sx={{ fontSize: { xs: '2.75rem', sm: '3.8rem', lg: '3.55rem' }, fontWeight: 800, lineHeight: 1 }}>
                {temperatureLabel}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Feels like: {feelsLikeLabel}
              </Typography>
            </Stack>

            {weatherIconUrl ? (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 0.75, sm: 1.5 }} justifyContent={{ xs: 'center', md: 'flex-start' }} alignItems="center" sx={{ minWidth: 0 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: { xs: 64, sm: 76, lg: 72 },
                    height: { xs: 64, sm: 76, lg: 72 },
                    borderRadius: '50%',
                    background: 'linear-gradient(180deg, rgba(30, 136, 200, 0.22) 0%, rgba(245, 250, 255, 0.98) 100%)',
                    border: '1px solid',
                    borderColor: 'rgba(30, 136, 200, 0.2)',
                    boxShadow: '0 6px 16px rgba(23, 50, 74, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.82)', // Helps light icons show better.
                    flexShrink: 0,
                  }}
                >
                  <Box
                    component="img"
                    src={weatherIconUrl}
                    alt={weatherIconAlt}
                    sx={{
                      width: '100%',
                      height: '100%',
                      filter: 'drop-shadow(0 2px 3px rgba(23, 50, 74, 0.34)) contrast(1.06)',
                    }}
                  />
                </Box>

                <Typography variant="h6" color="text.secondary" sx={{ textTransform: 'capitalize', fontSize: { xs: '1rem', sm: '1.1rem', lg: '1.05rem' }, textAlign: { xs: 'center', sm: 'left' }, overflowWrap: 'anywhere' }}>
                  {message}
                </Typography>
              </Stack>
            ) : (
              <Typography variant="h6" color="text.secondary" sx={{ textTransform: 'capitalize', textAlign: { xs: 'center', md: 'left' }, fontSize: { xs: '1rem', sm: '1.1rem', lg: '1.05rem' }, overflowWrap: 'anywhere' }}>
                {message}
              </Typography>
            )}
          </Box>

          {/* Detail boxes */}
          <Box
            sx={{
              display: 'grid',
              gap: { xs: 0.9, sm: 1, lg: 0.85 },
              gridTemplateColumns: { xs: '1fr', xl: 'repeat(2, minmax(0, 1fr))' },
              minWidth: 0, // Let the detail boxes shrink inside the card.
            }}
          >
            {detailItems.map((detailItem) => (
              <WeatherDetailTile key={detailItem.label} label={detailItem.label} value={detailItem.value} />
            ))}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default WeatherCard