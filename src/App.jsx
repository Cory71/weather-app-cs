import { useEffect, useState } from 'react'
import { Box, Button, Divider, Menu, MenuItem, Stack, Typography } from '@mui/material'
import ErrorAlert from './components/ErrorAlert.jsx'
import ForecastList from './components/ForecastList.jsx'
import LoadingSpinner from './components/LoadingSpinner.jsx'
import SearchBar from './components/SearchBar.jsx'
import WeatherCard from './components/WeatherCard.jsx'

// Main values
const DEFAULT_CITY = 'Nanaimo, CA'
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'

// Get API key
function getOpenWeatherApiKey() {
  return import.meta.env.VITE_OPENWEATHER_API_KEY?.trim() ?? ''
}

// Build request URL
function buildRequestUrl(pathname, cityName, apiKey) {
  const queryString = new URLSearchParams({
    q: cityName,
    appid: apiKey,
    units: 'metric', // Keep metric as the base data.
  }).toString()

  return `${WEATHER_BASE_URL}/${pathname}?${queryString}`
}

// Error messages
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

// Pick five forecast items
function getForecastPreviewItems(forecastItems) {
  const middayItems = forecastItems.filter((forecastItem) => forecastItem.dt_txt?.includes('12:00:00'))

  if (middayItems.length >= 5) {
    return middayItems.slice(0, 5)
  }

  return forecastItems.filter((forecastItem, index) => index % 8 === 0).slice(0, 5) // About 8 entries is one day.
}

// Search helper text
function formatHelperCityName(cityName) {
  return cityName.replace(/,\s*/g, ', ')
}

function getSearchHelperText(searchInput, selectedCity, errorMessage, isLoading) {
  const typedCity = searchInput.trim()
  const formattedTypedCity = formatHelperCityName(typedCity)
  const formattedSelectedCity = formatHelperCityName(selectedCity)

  if (errorMessage) {
    return errorMessage
  }

  if (!typedCity) {
    return 'Enter a city to display weather information.'
  }

  if (isLoading) {
    return `Loading weather for ${formattedSelectedCity}...`
  }

  if (!selectedCity || typedCity.toLowerCase() !== selectedCity.toLowerCase()) {
    return `Press Search to update the weather for ${formattedTypedCity}.`
  }

  return `Showing weather for ${formattedSelectedCity}. Press Search to refresh data.`
}

// Search error check
function isSearchFieldError(errorMessage) {
  if (!errorMessage) {
    return false
  }

  return errorMessage.includes('Please enter a city name') || errorMessage.includes('find that city')
}

function App({ themeMode, themePreference, onThemePreferenceChange }) {
  // State
  const [searchInput, setSearchInput] = useState(DEFAULT_CITY)
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY)
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState([])
  const [forecastEntries, setForecastEntries] = useState([]) // Keep the full forecast list.
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [temperatureUnit, setTemperatureUnit] = useState('celsius')
  const [searchVersion, setSearchVersion] = useState(0)
  const [settingsAnchor, setSettingsAnchor] = useState(null)

  // Clear old results
  function clearWeatherResults() {
    setWeatherData(null)
    setForecastData([])
    setForecastEntries([])
  }

  // Update search box
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

  // Open settings menu
  function handleSettingsOpen(event) {
    setSettingsAnchor(event.currentTarget)
  }

  // Close settings menu
  function handleSettingsClose() {
    setSettingsAnchor(null)
  }

  // Update theme from the menu
  function handleThemeMenuClick(nextThemePreference) {
    onThemePreferenceChange(nextThemePreference)
    handleSettingsClose()
  }

  // Update unit from the menu
  function handleUnitMenuClick(nextUnit) {
    handleUnitChange(nextUnit)
    handleSettingsClose()
  }

  // Submit search
  function handleSearchSubmit(event) {
    event.preventDefault()

    const cityName = searchInput.trim() // Remove extra spaces.

    if (!cityName) {
      setIsLoading(false)
      setSelectedCity('')
      clearWeatherResults()
      setErrorMessage('Please enter a city name before searching.')
      return
    }

    setIsLoading(false)
    setErrorMessage('')
    setSelectedCity(cityName)
    clearWeatherResults()
    setSearchVersion((currentVersion) => currentVersion + 1) // Run the search again, even for the same city.
  }

  // Load weather data
  useEffect(() => {
    const apiKey = getOpenWeatherApiKey()

    if (!selectedCity) {
      return undefined
    }

    if (!apiKey) {
      setIsLoading(false)
      clearWeatherResults()
      setErrorMessage(getMissingApiKeyMessage())
      return undefined
    }

    const abortController = new AbortController() // Stop old requests if the city changes.

    // Get JSON from the API
    async function fetchJson(url) {
      const response = await fetch(url, { signal: abortController.signal })

      if (!response.ok) {
        throw new Error(await readErrorMessage(response))
      }

      return response.json()
    }

    async function fetchWeatherData() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const weatherUrl = buildRequestUrl('weather', selectedCity, apiKey)
        const forecastUrl = buildRequestUrl('forecast', selectedCity, apiKey)

        const [weatherResponseData, forecastResponseData] = await Promise.all([
          fetchJson(weatherUrl),
          fetchJson(forecastUrl),
        ])

        const allForecastEntries = forecastResponseData.list ?? [] // Use an empty list if forecast data is missing.

        setWeatherData(weatherResponseData)
        setForecastEntries(allForecastEntries)
        setForecastData(getForecastPreviewItems(allForecastEntries))
      } catch (error) {
        if (error.name === 'AbortError') {
          return
        }

        clearWeatherResults()
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

  const searchHelperText = getSearchHelperText(searchInput, selectedCity, errorMessage, isLoading)
  const hasSearchFieldError = isSearchFieldError(errorMessage)
  const currentYear = new Date().getFullYear()
  const isSettingsOpen = Boolean(settingsAnchor)

  // Page layout
  return (
    <Box component="main" className="app-shell" data-theme={themeMode}>
      <Box sx={{ width: '100%', maxWidth: 1120, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4, md: 6 } }}>
        <Stack spacing={{ xs: 2.5, sm: 3.5 }}>
          <Box
            sx={{
              width: '100%',
              p: { xs: 2, sm: 3 },
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: { xs: 3, sm: 4 },
              background: 'var(--app-hero-panel)',
              boxShadow: 'var(--app-shadow)',
              overflow: 'hidden',
            }}
          >
            <Stack spacing={{ xs: 2.25, sm: 3 }}>
              {/* Title area */}
              <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="flex-start">
                <Stack spacing={{ xs: 1.25, sm: 1.5 }} sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    sx={{
                      m: 0,
                      fontSize: { xs: '0.82rem', sm: '0.95rem' },
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--app-kicker)',
                    }}
                  >
                    Local Weather Dashboard
                  </Typography>
                  <Typography
                    variant="h1"
                    sx={{
                      m: 0,
                      fontSize: { xs: '1.75rem', sm: 'clamp(2rem, 5vw, 3.4rem)' },
                      lineHeight: 1.1,
                      letterSpacing: '-0.04em',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    SkyCast
                  </Typography>
                </Stack>

                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleSettingsOpen}
                  aria-label="Open settings menu"
                  aria-controls={isSettingsOpen ? 'weather-settings-menu' : undefined}
                  aria-expanded={isSettingsOpen ? 'true' : undefined}
                  aria-haspopup="true"
                  sx={{
                    minWidth: 44,
                    width: 44,
                    height: 44,
                    px: 0,
                    py: 0,
                    alignSelf: 'flex-start',
                    borderWidth: 1.5,
                    color: 'text.primary',
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  <span aria-hidden="true">⚙</span>
                </Button>
              </Stack>

              <Menu
                id="weather-settings-menu"
                anchorEl={settingsAnchor}
                open={isSettingsOpen}
                onClose={handleSettingsClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                  paper: {
                    sx: {
                      width: 190,
                    },
                  },
                }}
              >
                <MenuItem disabled dense>
                  Theme mode
                </MenuItem>
                <MenuItem dense selected={themePreference === 'system'} onClick={() => handleThemeMenuClick('system')}>
                  System
                </MenuItem>
                <MenuItem dense selected={themePreference === 'light'} onClick={() => handleThemeMenuClick('light')}>
                  Light
                </MenuItem>
                <MenuItem dense selected={themePreference === 'dark'} onClick={() => handleThemeMenuClick('dark')}>
                  Dark
                </MenuItem>
                <Divider />
                <MenuItem disabled dense>
                  Temperature unit
                </MenuItem>
                <MenuItem dense selected={temperatureUnit === 'celsius'} onClick={() => handleUnitMenuClick('celsius')}>
                  Celsius
                </MenuItem>
                <MenuItem dense selected={temperatureUnit === 'fahrenheit'} onClick={() => handleUnitMenuClick('fahrenheit')}>
                  Fahrenheit
                </MenuItem>
              </Menu>

              {/* Search area */}
              <Stack direction={{ xs: 'column', lg: 'row' }} spacing={{ xs: 2, sm: 2.5, lg: 2 }} alignItems={{ xs: 'stretch', lg: 'flex-start' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}> {/* Let the search box fit on small screens. */}
                  <SearchBar
                    searchInput={searchInput}
                    helperText={searchHelperText}
                    hasError={hasSearchFieldError}
                    isLoading={isLoading}
                    onSearchInputChange={handleSearchInputChange}
                    onSearchSubmit={handleSearchSubmit}
                  />
                </Box>
              </Stack>
            </Stack>
          </Box>

          <ErrorAlert message={errorMessage} />
          <LoadingSpinner isLoading={isLoading} />

          {/* Weather panels */}
          <Box
            sx={{
              display: 'grid',
              gap: { xs: 1.75, sm: 2 },
              alignItems: 'start',
              gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) minmax(0, 1fr)' },
              '& > *': {
                minWidth: 0,
              },
            }}
          >
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

          {/* Footer */}
          <Stack spacing={0.5} alignItems="center" sx={{ pt: 1, textAlign: 'center' }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: 'text.secondary',
              }}
            >
              SkyCast • {currentYear}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}

export default App
