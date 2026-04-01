import { useEffect, useState } from 'react'
import { Box, Container, Stack, Typography } from '@mui/material'
import ErrorAlert from './components/ErrorAlert.jsx'
import ForecastList from './components/ForecastList.jsx'
import LoadingSpinner from './components/LoadingSpinner.jsx'
import SearchBar from './components/SearchBar.jsx'
import UnitToggle from './components/UnitToggle.jsx'
import WeatherCard from './components/WeatherCard.jsx'

const DEFAULT_CITY = 'Nanaimo,CA'
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'

// API key helper
function getOpenWeatherApiKey() {
  return import.meta.env.VITE_OPENWEATHER_API_KEY?.trim() ?? ''
}

// Request URL helper
function buildRequestUrl(pathname, cityName, apiKey) {
  const queryString = new URLSearchParams({
    q: cityName,
    appid: apiKey,
    units: 'metric', // Start with metric so Celsius mode is the base data.
  }).toString()

  return `${WEATHER_BASE_URL}/${pathname}?${queryString}`
}

// Error message helpers
function getMissingApiKeyMessage() {
  return 'Add your OpenWeatherMap API key to a .env file as VITE_OPENWEATHER_API_KEY.'
}

function getRequestErrorMessage(apiMessage) {
  if (!apiMessage) {
    return 'Unable to load weather data right now. Please try again.'
  }

  if (apiMessage.toLowerCase() === 'city not found') {
    return 'We could not find that city. Check the spelling and try again.'
  }

  return `Weather request failed: ${apiMessage}.`
}

async function readErrorMessage(response) {
  try {
    const responseData = await response.json()
    return getRequestErrorMessage(responseData.message)
  } catch {
    return getRequestErrorMessage('Unexpected server response')
  }
}

// Forecast helper
function getForecastPreviewItems(forecastItems) {
  const middayItems = forecastItems.filter((forecastItem) => forecastItem.dt_txt?.includes('12:00:00'))

  if (middayItems.length >= 5) {
    return middayItems.slice(0, 5)
  }

  return forecastItems.filter((forecastItem, index) => index % 8 === 0).slice(0, 5) // About 8 entries is one day in 3-hour data.
}

// Search helper text
function getSearchHelperText(selectedCity, errorMessage, isLoading) {
  if (errorMessage) {
    return 'Add a city name, then submit the form again.'
  }

  if (isLoading) {
    return `Loading weather for ${selectedCity}...`
  }

  if (!selectedCity) {
    return 'Try Nanaimo, Vancouver, or Toronto.'
  }

  return `Search is set for ${selectedCity}. Submit the form to load fresh weather data.`
}

function App() {
  // App state
  const [searchInput, setSearchInput] = useState(DEFAULT_CITY)
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY)
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState([])
  const [forecastEntries, setForecastEntries] = useState([]) // Keep the full list for day-based forecast details.
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [temperatureUnit, setTemperatureUnit] = useState('celsius')
  const [searchVersion, setSearchVersion] = useState(0)

  // Search handlers
  function handleSearchInputChange(event) {
    const nextValue = event.target.value

    setSearchInput(nextValue)

    if (errorMessage) {
      setErrorMessage('')
    }
  }

  function handleUnitChange(nextUnit) {
    setTemperatureUnit(nextUnit)
  }

  function handleSearchSubmit(event) {
    event.preventDefault()

    const cityName = searchInput.trim() // Remove spaces before validation.

    if (!cityName) {
      setIsLoading(false)
      setSelectedCity('')
      setWeatherData(null)
      setForecastData([])
      setForecastEntries([])
      setErrorMessage('Please enter a city name before searching.')
      return
    }

    setIsLoading(false)
    setErrorMessage('')
    setSelectedCity(cityName)
    setWeatherData(null)
    setForecastData([])
    setForecastEntries([])
    setSearchVersion((currentVersion) => currentVersion + 1) // Force a fresh fetch, even for the same city.
  }

  // Weather fetch effect
  useEffect(() => {
    const apiKey = getOpenWeatherApiKey()

    if (!selectedCity) {
      return undefined
    }

    if (!apiKey) {
      setIsLoading(false)
      setWeatherData(null)
      setForecastData([])
      setForecastEntries([])
      setErrorMessage(getMissingApiKeyMessage())
      return undefined
    }

    const abortController = new AbortController() // Cancel old requests when the city changes fast.

    async function fetchWeatherData() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const weatherUrl = buildRequestUrl('weather', selectedCity, apiKey)
        const forecastUrl = buildRequestUrl('forecast', selectedCity, apiKey)

        const [weatherResponse, forecastResponse] = await Promise.all([
          fetch(weatherUrl, { signal: abortController.signal }),
          fetch(forecastUrl, { signal: abortController.signal }),
        ]) // Load both endpoints together to keep the UI in sync.

        if (!weatherResponse.ok) {
          throw new Error(await readErrorMessage(weatherResponse))
        }

        if (!forecastResponse.ok) {
          throw new Error(await readErrorMessage(forecastResponse))
        }

        const [weatherResponseData, forecastResponseData] = await Promise.all([
          weatherResponse.json(),
          forecastResponse.json(),
        ])

        const allForecastEntries = forecastResponseData.list ?? [] // Fall back to an empty list if the API omits forecast items.

        setWeatherData(weatherResponseData)
        setForecastEntries(allForecastEntries)
        setForecastData(getForecastPreviewItems(allForecastEntries))
      } catch (error) {
        if (error.name === 'AbortError') {
          return
        }

        setWeatherData(null)
        setForecastData([])
        setForecastEntries([])
        setErrorMessage(error.message)
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    fetchWeatherData()

    return () => {
      abortController.abort()
    }
  }, [searchVersion, selectedCity])

  const searchHelperText = getSearchHelperText(selectedCity, errorMessage, isLoading)

  // Main app layout
  return (
    <Box component="main" className="app-shell">
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Stack spacing={3.5}>
          <Box className="hero-panel">
            <Stack spacing={3}>
              <Stack spacing={1.5}>
                <Typography className="app-kicker">Phase 3 API Setup And Fetch Flow</Typography>
                <Typography variant="h1" className="app-title">
                  SkyCast
                </Typography>
                <Typography className="app-copy">
                  The app now reads an OpenWeatherMap API key from your env file
                  and fetches current weather plus forecast data for the active city.
                </Typography>
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
                <SearchBar
                  searchInput={searchInput}
                  helperText={searchHelperText}
                  isLoading={isLoading}
                  onSearchInputChange={handleSearchInputChange}
                  onSearchSubmit={handleSearchSubmit}
                />

                <UnitToggle temperatureUnit={temperatureUnit} onUnitChange={handleUnitChange} />
              </Stack>
            </Stack>
          </Box>

          <ErrorAlert message={errorMessage} />
          <LoadingSpinner isLoading={isLoading} />

          <Box className="content-grid">
            <WeatherCard
              selectedCity={selectedCity}
              temperatureUnit={temperatureUnit}
              weatherData={weatherData}
            />

            <ForecastList
              forecastData={forecastData}
              forecastEntries={forecastEntries}
              selectedCity={selectedCity}
              temperatureUnit={temperatureUnit}
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default App
