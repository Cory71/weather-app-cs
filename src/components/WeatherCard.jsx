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
  const compassIndex = Math.round(windDegrees / 45) % compassDirections.length // Split the compass into 8 simple directions.

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

// Display text helpers
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
    timeZone: 'UTC', // Use UTC here because the API offset is already added above.
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
    timeZone: 'UTC', // Use UTC here because the API offset is already added above.
  })
}

// Icon helper
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

function WeatherCard({ selectedCity, temperatureUnit, weatherData }) {
  // Card display values
  const unitLabel = temperatureUnit === 'celsius' ? 'Celsius' : 'Fahrenheit'
  const locationLabel = getLocationLabel(weatherData, selectedCity)
  const message = getWeatherMessage(selectedCity, weatherData)
  const temperatureLabel = weatherData?.main ? formatTemperature(weatherData.main.temp, temperatureUnit) : '--'
  const feelsLikeLabel = weatherData?.main ? formatTemperature(weatherData.main.feels_like, temperatureUnit) : '--'
  const humidityLabel = weatherData?.main?.humidity != null ? `${weatherData.main.humidity}%` : '--'
  const windSpeedLabel = weatherData?.wind?.speed != null ? formatWindSpeed(weatherData.wind.speed, temperatureUnit) : '--'
  const windDirectionLabel = formatWindDirection(weatherData?.wind?.deg)
  const visibilityLabel = formatVisibility(weatherData?.visibility, temperatureUnit)
  const cloudCoverageLabel = weatherData?.clouds?.all != null ? `${weatherData.clouds.all}%` : '--'
  const sunriseLabel = formatCityTime(weatherData?.sys?.sunrise, weatherData?.timezone)
  const sunsetLabel = formatCityTime(weatherData?.sys?.sunset, weatherData?.timezone)
  const localTimeLabel = formatCityDateTime(weatherData?.dt, weatherData?.timezone)
  const weatherIconUrl = getWeatherIconUrl(weatherData?.weather?.[0]?.icon)
  const weatherIconAlt = weatherData?.weather?.[0]?.description || 'Weather icon'

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
                {locationLabel}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Local time: {localTimeLabel}
              </Typography>
            </div>

            <Chip label={unitLabel} color="primary" variant="outlined" />
          </Stack>

          {/* Weather icon and condition */}
          {weatherIconUrl ? (
            <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center">
              <Box
                component="img"
                src={weatherIconUrl}
                alt={weatherIconAlt}
                sx={{ width: 84, height: 84 }}
              />

              <Typography variant="body1" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                {message}
              </Typography>
            </Stack>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
              {message}
            </Typography>
          )}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Chip label={`Temp: ${temperatureLabel}`} variant="filled" color="primary" />
            <Chip label={`Feels like: ${feelsLikeLabel}`} variant="outlined" />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Chip label={`Humidity: ${humidityLabel}`} variant="outlined" />
            <Chip label={`Wind: ${windSpeedLabel} ${windDirectionLabel}`} variant="outlined" />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Chip label={`Visibility: ${visibilityLabel}`} variant="outlined" />
            <Chip label={`Clouds: ${cloudCoverageLabel}`} variant="outlined" />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Chip label={`Sunrise: ${sunriseLabel}`} variant="outlined" />
            <Chip label={`Sunset: ${sunsetLabel}`} variant="outlined" />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default WeatherCard