import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import './index.css'
import App from './App.jsx'

// App theme setup
const appTheme = createTheme({
  palette: {
    primary: {
      main: '#1e88c8',
    },
    secondary: {
      main: '#ef8f2f',
    },
    background: {
      default: '#f6fbff',
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

// App render
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={appTheme}>
      <CssBaseline /> {/* Reset browser defaults for a cleaner base. */}
      <App />
    </ThemeProvider>
  </StrictMode>,
)
