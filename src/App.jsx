import { useEffect, useState } from 'react'
import { Box, Button, Divider, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material'
import ErrorAlert from './components/ErrorAlert.jsx'
import FavoriteButton from './components/FavoriteButton.jsx'
import ForecastList from './components/ForecastList.jsx'
import LoadingSpinner from './components/LoadingSpinner.jsx'
import LocationButton from './components/LocationButton.jsx'
import SearchBar from './components/SearchBar.jsx'
import WeatherCard from './components/WeatherCard.jsx'
import requestDeviceLocation from './deviceLocation.js'
import { readStoredJson, saveStoredJson } from './appStorage.js'
import {
  addFavoriteCity,
  cleanFavoriteCities,
  isFavoriteCity,
  removeFavoriteCity,
} from './favoriteCities.js'

// Main values
const DEFAULT_CITY = 'Nanaimo, CA'
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'
const GEOCODE_BASE_URL = 'https://api.openweathermap.org/geo/1.0'
const FAVORITES_STORAGE_KEY = 'skycast-favorites'
const AUTO_LOCATION_STORAGE_KEY = 'skycast-auto-location'

// Read the startup setting once so the first render knows where to look.
const startupUsesLocation = readStoredJson(AUTO_LOCATION_STORAGE_KEY, false) === true
const startupCity = startupUsesLocation ? '' : DEFAULT_CITY

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

// Build the URL that turns coordinates back into a place name
function buildReverseGeocodeUrl(latitude, longitude, apiKey) {
  const queryString = new URLSearchParams({
    lat: latitude,
    lon: longitude,
    limit: 1, // Only need the closest place.
    appid: apiKey,
  }).toString()

  return `${GEOCODE_BASE_URL}/reverse?${queryString}`
}

// Turn a geocoding result into a city name the search box can use
function formatDetectedCity(place) {
  if (!place?.name) {
    return ''
  }

  if (!place.country) {
    return place.name
  }

  return `${place.name}, ${place.country}`
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
  const [searchInput, setSearchInput] = useState(startupCity)
  const [selectedCity, setSelectedCity] = useState(startupCity)
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState([])
  const [forecastEntries, setForecastEntries] = useState([]) // Keep the full forecast list.
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [temperatureUnit, setTemperatureUnit] = useState('celsius')
  const [searchVersion, setSearchVersion] = useState(0)
  const [settingsAnchor, setSettingsAnchor] = useState(null)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [locationMessage, setLocationMessage] = useState('')
  const [favoriteCities, setFavoriteCities] = useState(() =>
    cleanFavoriteCities(readStoredJson(FAVORITES_STORAGE_KEY, [])),
  )
  const [useLocationOnStartup, setUseLocationOnStartup] = useState(startupUsesLocation)

  // Clear old results
  function clearWeatherResults() {
    setWeatherData(null)
    setForecastData([])
    setForecastEntries([])
  }

  // Load weather for a city and show its name in the search box
  function applySelectedCity(cityName) {
    setSearchInput(cityName)
    setSelectedCity(cityName)
    clearWeatherResults()
    setSearchVersion((currentVersion) => currentVersion + 1) // Run the search again, even for the same city.
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

  // Save or remove the current city with the star button
  function handleToggleFavorite() {
    if (!selectedCity) {
      return
    }

    setFavoriteCities((currentFavorites) =>
      isFavoriteCity(currentFavorites, selectedCity)
        ? removeFavoriteCity(currentFavorites, selectedCity)
        : addFavoriteCity(currentFavorites, selectedCity),
    )
  }

  // Save the current city from the menu
  function handleSaveCurrentCityClick() {
    setFavoriteCities((currentFavorites) => addFavoriteCity(currentFavorites, selectedCity))
    handleSettingsClose()
  }

  // Load a saved city from the menu
  function handleFavoriteMenuClick(favoriteCity) {
    setErrorMessage('')
    setLocationMessage('')
    applySelectedCity(favoriteCity)
    handleSettingsClose()
  }

  // Remove a saved city without closing the menu
  function handleRemoveFavoriteClick(event, favoriteCity) {
    event.stopPropagation() // Keep the menu open instead of loading the city.
    setFavoriteCities((currentFavorites) => removeFavoriteCity(currentFavorites, favoriteCity))
  }

  // Turn startup location detection on or off
  function handleStartupLocationToggle() {
    setUseLocationOnStartup((currentSetting) => !currentSetting)
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
    setLocationMessage('')
    setSelectedCity(cityName)
    clearWeatherResults()
    setSearchVersion((currentVersion) => currentVersion + 1) // Run the search again, even for the same city.
  }

  // Look up the city name for the device location
  async function findCityFromDeviceLocation(apiKey) {
    const { latitude, longitude } = await requestDeviceLocation()
    const response = await fetch(buildReverseGeocodeUrl(latitude, longitude, apiKey))

    if (!response.ok) {
      throw new Error(await readErrorMessage(response))
    }

    const places = await response.json()
    const detectedCity = formatDetectedCity(places[0]) // The closest place comes back first.

    if (!detectedCity) {
      throw new Error('We could not match your location to a city. Please search instead.')
    }

    return detectedCity
  }

  // Search using the device location
  // fallbackCity keeps the app useful when startup detection fails.
  async function startLocationSearch(fallbackCity) {
    const apiKey = getOpenWeatherApiKey()

    if (!apiKey) {
      setErrorMessage(getMissingApiKeyMessage())
      return
    }

    setIsDetectingLocation(true)
    setLocationMessage('')

    try {
      const detectedCity = await findCityFromDeviceLocation(apiKey)

      applySelectedCity(detectedCity) // Show the user which city was found.
    } catch (error) {
      setLocationMessage(error.message)

      if (fallbackCity) {
        applySelectedCity(fallbackCity)
      }
    } finally {
      setIsDetectingLocation(false)
    }
  }

  // Detect the location from the button
  function handleUseMyLocation() {
    startLocationSearch('') // No fallback, the current city stays on screen.
  }

  // Remember the saved cities
  useEffect(() => {
    saveStoredJson(FAVORITES_STORAGE_KEY, favoriteCities)
  }, [favoriteCities])

  // Remember the startup location setting
  useEffect(() => {
    saveStoredJson(AUTO_LOCATION_STORAGE_KEY, useLocationOnStartup)
  }, [useLocationOnStartup])

  // Detect the location once when the startup setting is on
  useEffect(() => {
    if (startupUsesLocation) {
      startLocationSearch(DEFAULT_CITY) // Show the default city if detection fails.
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- run once on startup only

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
  const isCurrentCityFavorite = isFavoriteCity(favoriteCities, selectedCity)

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
                      width: 240,
                    },
                  },
                }}
              >
                <MenuItem disabled dense>
                  Favorites
                </MenuItem>
                <MenuItem
                  dense
                  disabled={!selectedCity || isCurrentCityFavorite}
                  onClick={handleSaveCurrentCityClick}
                >
                  {isCurrentCityFavorite ? 'Current city saved' : 'Save current city'}
                </MenuItem>
                {favoriteCities.length === 0 && (
                  <MenuItem disabled dense>
                    No saved cities yet
                  </MenuItem>
                )}
                {favoriteCities.map((favoriteCity) => (
                  <MenuItem
                    key={favoriteCity}
                    dense
                    selected={favoriteCity === selectedCity}
                    onClick={() => handleFavoriteMenuClick(favoriteCity)}
                  >
                    {/* City name on the left, remove button on the right */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', minWidth: 0 }}>
                      <Box
                        sx={{
                          flex: 1,
                          minWidth: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {favoriteCity}
                      </Box>
                      <IconButton
                        size="small"
                        aria-label={`Remove ${favoriteCity} from favorites`}
                        onClick={(event) => handleRemoveFavoriteClick(event, favoriteCity)}
                        sx={{ fontSize: '1rem', lineHeight: 1 }}
                      >
                        <span aria-hidden="true">×</span>
                      </IconButton>
                    </Box>
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem disabled dense>
                  Location
                </MenuItem>
                <MenuItem dense selected={useLocationOnStartup} onClick={handleStartupLocationToggle}>
                  Use my location on startup {useLocationOnStartup ? '✓' : ''}
                </MenuItem>
                <Divider />
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

                {/* Keep the two small buttons side by side on every screen size */}
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Box sx={{ flex: { xs: 1, lg: '0 0 auto' }, minWidth: 0 }}>
                    <LocationButton
                      isDetecting={isDetectingLocation}
                      isDisabled={isDetectingLocation || isLoading}
                      onUseMyLocation={handleUseMyLocation}
                    />
                  </Box>

                  <FavoriteButton
                    isFavorite={isCurrentCityFavorite}
                    isDisabled={!selectedCity}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </Stack>
              </Stack>
            </Stack>
          </Box>

          <ErrorAlert message={locationMessage} title="Location issue" />
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
