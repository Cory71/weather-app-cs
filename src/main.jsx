import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import './index.css'
import App from './App.jsx'

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

// Root app component
function RootApp() {
  // Theme state
  const [themeMode, setThemeMode] = useState('light')
  const appTheme = getAppTheme(themeMode)

  // Theme provider wrapper
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline /> {/* Reset browser defaults for a cleaner base. */}
      <App themeMode={themeMode} onThemeModeChange={setThemeMode} />
    </ThemeProvider>
  )
}

// App render
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootApp />
  </StrictMode>,
)
