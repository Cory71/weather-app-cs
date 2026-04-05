import { Button, Stack, Typography } from '@mui/material'

// Theme mode toggle
function ThemeToggle({ themeMode, onThemeModeChange }) {
  // Theme switcher buttons
  return (
    <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1.25} alignItems={{ xs: 'stretch', lg: 'center' }} sx={{ minWidth: 0 }}>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Theme mode
      </Typography>

      {/* Toggle buttons */}
      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ justifyContent: 'flex-start', minWidth: 0 }}> {/* Wrap the buttons instead of forcing one long row. */}
        <Button
          variant={themeMode === 'light' ? 'contained' : 'outlined'}
          onClick={() => onThemeModeChange('light')}
          sx={{ minWidth: 88 }}
        >
          Light
        </Button>

        <Button
          variant={themeMode === 'dark' ? 'contained' : 'outlined'}
          onClick={() => onThemeModeChange('dark')}
          sx={{ minWidth: 88 }}
        >
          Dark
        </Button>
      </Stack>
    </Stack>
  )
}

export default ThemeToggle