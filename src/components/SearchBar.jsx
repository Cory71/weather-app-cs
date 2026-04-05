import { Box, Button, TextField } from '@mui/material'

// Search form component
function SearchBar({
  searchInput,
  helperText,
  hasError,
  isLoading,
  onSearchInputChange,
  onSearchSubmit,
}) {
  // Search form layout
  return (
    <Box component="form" onSubmit={onSearchSubmit} noValidate sx={{ minWidth: 0 }}> {/* Let React handle the form feedback. */}
      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) auto' },
          alignItems: 'start',
          minWidth: 0, // Let the field shrink instead of overflowing its container.
        }}
      >
        {/* Search input */}
        <TextField
          fullWidth
          error={hasError}
          label="Search by city"
          placeholder="Enter a city name"
          value={searchInput}
          onChange={onSearchInputChange}
          helperText={helperText}
          sx={{ minWidth: 0 }} // Prevent long helper text from widening the form.
        />

        {/* Submit button */}
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={isLoading}
          sx={{ minHeight: 56, px: 3.5 }} // Match the text field height.
        >
          {isLoading ? 'Loading...' : 'Search'}
        </Button>
      </Box>
    </Box>
  )
}

export default SearchBar