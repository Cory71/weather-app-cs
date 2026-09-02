import { Button } from '@mui/material'

// Star button that saves or removes the current city
function FavoriteButton({ isFavorite, isDisabled, onToggleFavorite }) {
  const buttonLabel = isFavorite ? 'Remove this city from favorites' : 'Save this city to favorites'

  return (
    <Button
      variant="outlined"
      size="large"
      onClick={onToggleFavorite}
      disabled={isDisabled}
      aria-label={buttonLabel}
      title={buttonLabel}
      sx={{ minHeight: 56, minWidth: 56, px: 0, fontSize: '1.4rem', lineHeight: 1 }} // Match the search field height.
    >
      <span aria-hidden="true">{isFavorite ? '★' : '☆'}</span>
    </Button>
  )
}

export default FavoriteButton
