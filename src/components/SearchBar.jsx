import { Box, Button, TextField } from '@mui/material'

// Search form component
function SearchBar({
  searchInput,
  helperText,
  isLoading,
  onSearchInputChange,
  onSearchSubmit,
}) {
  // Search form layout
  return (
    <Box component="form" onSubmit={onSearchSubmit} noValidate> {/* Let React handle the form feedback. */}
      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) auto' }, // Stack on mobile, split on wider screens.
          alignItems: 'start',
        }}
      >
        {/* Search input */}
        <TextField
          fullWidth
          label="Search by city"
          placeholder="Enter a city name"
          value={searchInput}
          onChange={onSearchInputChange}
          helperText={helperText}
        />

        {/* Submit button */}
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{ minHeight: 56, px: 3.5 }} // Match the text field height.
        >
          Search
        </Button>
      </Box>
    </Box>
  )
}

export default SearchBar