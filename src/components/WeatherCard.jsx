import { Card, CardContent, Chip, Stack, Typography } from '@mui/material'

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
  const humidityLabel = weatherData?.main?.humidity != null ? `${weatherData.main.humidity}%` : '--'
  const windSpeedLabel = weatherData?.wind?.speed != null ? formatWindSpeed(weatherData.wind.speed, temperatureUnit) : '--'
  const windDirectionLabel = formatWindDirection(weatherData?.wind?.deg)
  const sunriseLabel = formatCityTime(weatherData?.sys?.sunrise, weatherData?.timezone)
  const sunsetLabel = formatCityTime(weatherData?.sys?.sunset, weatherData?.timezone)

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
            </div>

            <Chip label={unitLabel} color="primary" variant="outlined" />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Chip label={`Temp: ${temperatureLabel}`} variant="filled" color="primary" />
            <Chip label={`Humidity: ${humidityLabel}`} variant="outlined" />
            <Chip label={`Wind: ${windSpeedLabel} ${windDirectionLabel}`} variant="outlined" />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Chip label={`Sunrise: ${sunriseLabel}`} variant="outlined" />
            <Chip label={`Sunset: ${sunsetLabel}`} variant="outlined" />
          </Stack>

          <Typography variant="body1" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
            {message}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default WeatherCard