import { useEffect, useState } from 'react'
import { CssBaseline, ThemeProvider, createTheme, useMediaQuery } from '@mui/material'
import App from './App.jsx'
import { readStoredText, saveStoredText } from './appStorage.js'

// App theme helper
function getAppTheme(themeMode) {
  const isDarkMode = themeMode === 'dark'

  return createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: isDarkMode ? '#7fc9ff' : '#1e88c8',
      },
      secondary: {
        main: isDarkMode ? '#ffbe72' : '#ef8f2f',
      },
      background: {
        default: isDarkMode ? '#0d1720' : '#f6fbff',
        paper: isDarkMode ? '#162430' : '#f5f8fa',
      },
    },
    shape: {
      borderRadius: 18,
    },
    typography: {
      fontFamily: ['Aptos', 'Trebuchet MS', 'Segoe UI', 'sans-serif'].join(','),
      h1: {
        fontWeight: 800,
      },
      h5: {
        fontWeight: 700,
      },
    },
  })
}

// Saved theme preference helpers
const THEME_STORAGE_KEY = 'skycast-theme' // Must match the startup script in index.html.
const THEME_PREFERENCES = ['system', 'light', 'dark']

function getStoredThemePreference() {
  const savedPreference = readStoredText(THEME_STORAGE_KEY, 'system')

  // Ignore anything that is not one of the three known choices.
  return THEME_PREFERENCES.includes(savedPreference) ? savedPreference : 'system'
}

function saveThemePreference(themePreference) {
  saveStoredText(THEME_STORAGE_KEY, themePreference)
}

// Turn the saved preference into the theme mode the app should show
function getActiveThemeMode(themePreference, prefersDarkMode) {
  if (themePreference === 'system') {
    return prefersDarkMode ? 'dark' : 'light' // Follow the device setting.
  }

  return themePreference
}

// Root app component
function RootApp() {
  // Theme state
  const [themePreference, setThemePreference] = useState(getStoredThemePreference) // 'system', 'light', or 'dark'.
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)') // Updates if the device setting changes.
  const themeMode = getActiveThemeMode(themePreference, prefersDarkMode)
  const appTheme = getAppTheme(themeMode)

  // Remember the choice for the next visit
  useEffect(() => {
    saveThemePreference(themePreference)
  }, [themePreference])

  // Keep the page background in step with the current mode
  useEffect(() => {
    document.documentElement.dataset.theme = themeMode
  }, [themeMode])

  // Theme provider wrapper
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline /> {/* Reset browser defaults for a cleaner base. */}
      <App
        themeMode={themeMode}
        themePreference={themePreference}
        onThemePreferenceChange={setThemePreference}
      />
    </ThemeProvider>
  )
}

export default RootApp
