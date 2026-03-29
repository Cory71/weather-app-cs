import { useState } from 'react'
import { Box, Container, Stack, Typography } from '@mui/material'
import ErrorAlert from './components/ErrorAlert.jsx'
import ForecastList from './components/ForecastList.jsx'
import LoadingSpinner from './components/LoadingSpinner.jsx'
import SearchBar from './components/SearchBar.jsx'
import UnitToggle from './components/UnitToggle.jsx'
import WeatherCard from './components/WeatherCard.jsx'

function getSearchHelperText(selectedCity, errorMessage) {
  // Search input helper copy
  if (errorMessage) {
    return 'Add a city name, then submit the form again.'
  }

  if (!selectedCity) {
    return 'Try Nanaimo, Vancouver, or Toronto.'
  }

  return `Search is set for ${selectedCity}. Weather data will connect in Phase 3.`
}

function App() {
  const [searchInput, setSearchInput] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [temperatureUnit, setTemperatureUnit] = useState('celsius')

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

    const cityName = searchInput.trim()

    if (!cityName) {
      setIsLoading(false)
      setSelectedCity('')
      setWeatherData(null)
      setForecastData([])
      setErrorMessage('Please enter a city name before searching.')
      return
    }

    setIsLoading(false)
    setErrorMessage('')
    setSelectedCity(cityName)
    setWeatherData(null)
    setForecastData([])
  }

  const searchHelperText = getSearchHelperText(selectedCity, errorMessage)

  // Main app layout
  return (
    <Box component="main" className="app-shell">
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Stack spacing={3.5}>
          <Box className="hero-panel">
            <Stack spacing={3}>
              <Stack spacing={1.5}>
                <Typography className="app-kicker">Phase 2 Layout And Search</Typography>
                <Typography variant="h1" className="app-title">
                  SkyCast
                </Typography>
                <Typography className="app-copy">
                  The app shell, search form, and core state are ready for the
                  OpenWeatherMap fetch work in the next phase.
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

            <ForecastList forecastData={forecastData} selectedCity={selectedCity} />
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default App
