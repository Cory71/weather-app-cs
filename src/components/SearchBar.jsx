import { Box, Button, TextField } from '@mui/material'

function SearchBar({
  searchInput,
  helperText,
  isLoading,
  onSearchInputChange,
  onSearchSubmit,
}) {
  // Search form layout
  return (
    <Box component="form" onSubmit={onSearchSubmit} noValidate>
      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) auto' },
          alignItems: 'start',
        }}
      >
        <TextField
          fullWidth
          label="Search by city"
          placeholder="Enter a city name"
          value={searchInput}
          onChange={onSearchInputChange}
          helperText={helperText}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{ minHeight: 56, px: 3.5 }}
        >
          Search
        </Button>
      </Box>
    </Box>
  )
}

export default SearchBar